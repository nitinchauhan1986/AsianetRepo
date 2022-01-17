/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import newrelic from 'newrelic';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import compression from 'compression';
import log4js from 'log4js';
import axios from 'axios';
// import querystring from 'querystring-browser';
// import appender from 'log4js-json';
import App from './components/App';
import Html from './components/Html';
import TestHtml from './components/TestHtml';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
// import errorPageStyle from './routes/error/ErrorPage.css';
import CustomUniveralRouter from './router';
// import models from './data/models';
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
// import { setRuntimeVariable } from './actions/runtime';
import config from './config';
// import { makeRequest } from './utils/makeRequest';
import { sanitizeQueryParams, getMsidFromPath } from './utils/common';
// import redisLib from './utils/redisClient';
import getRequestMappings from './utils/requestLogic';
// const isProduction = process.env.NODE_ENV === 'production';

const zlib = require('zlib');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEY_BUCKET,
  secretAccessKey: process.env.SECRETKEY_BUCKET,
  // region: '',
});

const app = express();
app.disable('x-powered-by');

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(compression());
app.use(express.static(path.resolve(__dirname, 'public')));

//
// Authentication
// -----------------------------------------------------------------------------
// app.use(
//   expressJwt({
//     secret: config.auth.jwt.secret,
//     credentialsRequired: false,
//     getToken: req => req.cookies.id_token,
//   }),
// );
// Error handler for express-jwt
// app.use((err, req, res, next) => {
//   // eslint-disable-line no-unused-vars
//   if (err instanceof Jwt401Error) {
//     console.error('[express-jwt-error]', req.cookies.id_token);
//     // `clearCookie`, otherwise user can't use web-app until cookie expires
//     res.clearCookie('id_token');
//   }
//   next(err);
// });

log4js.configure(config.log4jsConfig);

//console.log('/log/node' + '/reactApp_debug.log');

// let logger = log4js.getLogger('app');

app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));

/*app.get('/feeds/*', (req, res) => {
  makeRequest
    .get(`https://timesofindia.indiatimes.com/${req.originalUrl}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      res.send({ error: `error occured in makeRequest :: ${err}` });
    });
}); */

if (__DEV__) {
  app.enable('trust proxy');
}

const uploadToS3 = (s3Path) => (error, result) => {
  if (!error) {
    const params = {
      ACL: 'public-read',
      Body: result,
      Bucket: 'til-toi-content',
      Key: s3Path,
      ContentType: 'text/html',
      ContentEncoding: 'gzip',
    };

    try {
      s3.putObject(params, (err) => {
        if (err) {
          // console.log(err, err.stack);
        } else {
          // console.log(data);
        }
      });
    } catch (e) {
      // console.log(e);
    }
  }
};

const getS3Path = (articlePath, options) => {
  let s3Path = '';
  const msid = getMsidFromPath(articlePath);
  const isNewArticle = options.isArticleshowV2ForS3;
  const bucketId = isNewArticle ? 'articleshowv2' : 'articleshow';
  if (msid && msid.length > 0) {
    if (options.isMobile) {
      if (options.isArticleshowMini) {
        s3Path = `${bucketId}/sptoi/articleshow_mini/msid-${msid}.htm`;
      } else if (options.frmapp) {
        s3Path = `${bucketId}/sptoi/articleshow/frmapp-yes,msid-${msid}.htm`;
      } else {
        s3Path = `${bucketId}/sptoi/articleshow/msid-${msid}.htm`;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (options.frmapp) {
        s3Path = `${bucketId}/toi/frmapp-yes,msid-${msid}.htm`;
      } else {
        s3Path = `${bucketId}/toi/msid-${msid}.htm`;
      }
    }
  }
  return s3Path;
};

const gzipAndUploadToS3 = async (htmlTxt, articlePath, options = {}) => {
  if (!articlePath) {
    return;
  }

  const s3Path = getS3Path(articlePath, options);
  if (s3Path) {
    zlib.gzip(htmlTxt, uploadToS3(s3Path));
  }
};

const deleteFileFromS3 = (articlePath, options = {}) => {
  const s3Path = getS3Path(articlePath, options);
  const params = {
    Bucket: 'til-toi-content',
    Key: s3Path,
  };

  try {
    s3.deleteObject(params, (err) => {
      if (err) {
        // console.log(err, err.stack);
      } else {
        // console.log(data);
      }
    });
  } catch (e) {
    // console.log(e);
  }
};

function getChromeVersion(userAgent) {
  try {
    const raw = userAgent && userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : false;
  } catch (error) {
    return false;
  }
}
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

app.get('*', async (req, res, next) => {
  let urlPath = req.path;
  // As urlpath is being changed creating duplicate
  const urlPathOriginal = req.path;
  // reset global node variables
  global.upcache = false;
  global.requestTimeStamp = undefined;
  global.isMobileUserAgent = false;
  const userAgent = typeof req.get === 'function' && req.get('User-Agent');
  const isHigherChrome = getChromeVersion(userAgent)
    ? getChromeVersion(userAgent) >= 90
    : false;
  const showArticleshowV2 =
    urlPath.includes('/articleshow/') &&
    (urlPath.includes('/india/') ||
      urlPath.includes('/world/') ||
      urlPath.includes('/city/') ||
      urlPath.includes('/business/') ||
      urlPath.includes('/elections/') ||
      urlPath.includes('/india-at-75/') ||
      urlPath.includes('/sports/'));
  const isVersion2 = req.path.includes('/liveblog/');
  const isIframe = urlPath.includes('/ifrmwdt/');

  // conditions may be added here for any pages which need utm based response caching
  const utmBasedCache = urlPath.includes('/amazon-bestsellers');

  const requestInformation = getRequestMappings({
    headers: req.headers,
    query: req.query,
    isVersion2,
    isIframe,
    utmBasedCache,
  });

  console.log('Redis Sub Key :: ', requestInformation.redisSubKey);

  try {
    //Handling for Articleshow Mini
    let isMini = req.originalUrl
      ? !!req.originalUrl.includes('asminitesting')
      : false;
    if (req.path.includes('/articleshow_mini/')) {
      urlPath = req.path.replace('/articleshow_mini/', '/articleshow/');
      isMini = true;
    }

    // send 404 error in case user is prime and lands on articleshow
    // if (
    //   urlPath &&
    //   urlPath.includes('/articleshow/') &&
    //   requestInformation.isPrime
    // ) {
    //   const errHtml = `<div>
    //   Something went wrong. Click
    //   <a href="https://timesofindia.indiatimes.com">here</a> to browse TOI
    // </div>`;
    //   res.status(404);
    //   res.send(errHtml);
    //   return;
    // }

    // eslint-disable-next-line eqeqeq
    // if (req.query.upcache != '2' && req.query.upcache != '3' && __PROD__) {
    //   const startDate = new Date().getTime();
    //   const redisDataObject = await redisLib.get(
    //     `${urlPathOriginal}${requestInformation.redisSubKey}`,
    //   );
    //   // console.log(data);
    //   const endDate = new Date().getTime();
    //   const htmlString = redisDataObject && redisDataObject.html;
    //   if (typeof htmlString === 'string') {
    //     // console.log(
    //     //   `served from redis cache:  ${urlPath}${
    //     //     requestInformation.redisSubKey
    //     //   }`,
    //     // );
    //     res.send(htmlString);
    //     console.log(`Redis key fetched in ${endDate - startDate}ms`);
    //     return;
    //   }
    //   // eslint-disable-next-line eqeqeq
    // } else if (req.query.upcache == '2') {
    //   global.upcache = true;
    //   global.requestTimeStamp = new Date().getTime();
    //   if (urlPath && urlPath.includes('/articleshow/') && __PROD__) {
    //     // clearFeedForArticleshow(
    //     //   urlPath,
    //     //   requestInformation.isWapPage,
    //     //   req.query.frmapp === 'yes',
    //     // );
    //   }
    // }
    if (requestInformation.isWapPage) {
      global.isMobileUserAgent = true;
    }

    const initialState = {
      isArticleshowMini: requestInformation.isWapPage && isMini,
      isArticleshowV2: req.query.utm === 'newas' || showArticleshowV2,
      isArticleshowV2ForS3: req.query.utm === 'newas',
      isLiveblogV2: req.query.utm === 'lbv2' || isVersion2,
      isPerpetualVideo: req.query.perpetual === 'true',
      isChromeTab: !!(requestInformation.isFrmapp && req.query.hv === 'yes'),
      isPrime: requestInformation.isPrime,
      headers: req.path.indexOf('show-headers') > 0 ? req.headers : undefined,
      isMobile: requestInformation.isWapPage,
      pageGenerationtime: new Date().toTimeString(),
      sid: process.env.SERVERIP || '-1',
      checkIsMini: isMini,
      isFrmapp: requestInformation.isFrmapp,
      url: req.url,
      // urlPath: req.path,
      ssrGeoCode: req.query.geolocation,
      geocl: req.query.geocl,
      isHigherChrome,
      // by default the sale nudge would be presumed visible
      // the sale nudge component would set this to false if switched off
      affiliates: {
        saleNudgeVisible: true,
      },
    };

    // eslint-disable-next-line eqeqeq
    // if (__PROD__ && req.query.upcache == '3') {
    //   const redisKeyToDelete = `${urlPathOriginal}${requestInformation.redisSubKey}`;
    //   redisLib.clearCache(redisKeyToDelete);
    //   console.log('Redis key deleted');
    //   if (urlPath && urlPath.includes('/articleshow/')) {
    //     deleteFileFromS3(urlPath, {
    //       ...initialState,
    //       frmapp: req.query.frmapp === 'yes',
    //       query: req.query,
    //     });
    //   }

    //   const responseHTML = `<!doctype html>Deleted cache for this url. Key is: ${redisKeyToDelete}`;
    //   res.status(200);
    //   res.send(responseHTML);
    //   return;
    // }

    const store = configureStore(initialState, {
      // I should not use `history` on server.. but how I do redirection? follow universal-router
    });

    // store.dispatch(
    //   setRuntimeVariable({
    //     name: 'initialNow',
    //     value: Date.now(),
    //   }),
    // );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // The twins below are wild, be careful!
      pathname: urlPath,
      query: sanitizeQueryParams(req.query),
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
    };

    const route = await CustomUniveralRouter(context, initialState).resolve(
      context,
    );

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <App context={context}>{route.component}</App>,
    );

    const styles = new Set();
    const scripts = new Set();
    const addChunk = (chunk, excludejs) => {
      if (chunks[chunk]) {
        chunks[chunk].forEach((asset) => {
          if (asset.endsWith('.css')) {
            styles.add(asset);
          } else if (!excludejs) {
            scripts.add(asset);
          }
        });
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`);
      }
    };
    addChunk('client');
    if (route.chunk) addChunk(route.chunk);
    if (route.chunks) route.chunks.forEach(addChunk);
    // if (!requestInformation.isWapPage) {
    //   addChunk('rhs', true);
    // }

    data.scripts = Array.from(scripts);
    data.styles = Array.from(styles);
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
      gaData: route.gaData || {},
    };
    data.singleURL = !!route.singleURL;

    //add preconnect domains
    data.preconnectDomains = route.preconnectDomains || [];
    data.preloadFontFamily =
      config.preloadFontFamily[data.fontName || 'montserrat' || 'default'];

    // if (__DEV__) {
    //   res.set('Cache-Control', 'public, no-cache, no-store, must-revalidate');
    //   res.set('Expires', '-1');
    //   res.set('Pragma', 'no-cache');
    // } else {

    if (route.maxAge) {
      res.set('Cache-Control', `public, max-age=${route.maxAge}`);
    } else {
      res.set('Cache-Control', `public, max-age=${config.maxAge}`);
    }

    // }
    let html;
    if (req.query.test && req.query.test === 'true') {
      html = ReactDOM.renderToStaticMarkup(<TestHtml {...data} />);
    } else {
      html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    }
    const responseHTML = `<!doctype html>${html}`;
    route.status = route.status || 200;
    res.status(route.status);
    res.send(responseHTML);

    // if (__PROD__ && route.status === 200) {
    //   redisLib.set(
    //     `${urlPathOriginal}${requestInformation.redisSubKey}`,
    //     responseHTML,
    //     route.maxAge || config.maxAge,
    //   );
    //   console.log(
    //     `res set in redis : ${urlPathOriginal}${requestInformation.redisSubKey}`,
    //   );
    // }

    global.upcache = false;
    global.requestTimeStamp = undefined;
    global.isMobileUserAgent = false;
    if (
      __PROD__ &&
      urlPath &&
      urlPath.includes('/articleshow/') &&
      !requestInformation.isPrime &&
      responseHTML &&
      typeof responseHTML === 'string' &&
      route.status === 200
    ) {
      gzipAndUploadToS3(responseHTML, urlPath, {
        ...initialState,
        frmapp: req.query.frmapp === 'yes',
        query: req.query,
      });
    }
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // logger.error("error",err);
  const html = ReactDOM.renderToStaticMarkup(
    <Html title="Internal Server Error" description={err.message}>
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
// const promise = models.sync().catch(err => console.error(err.stack));

if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
