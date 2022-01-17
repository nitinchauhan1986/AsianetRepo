/* eslint-disable linebreak-style */
import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
// import { gdprScriptString } from 'helpers/gdpr12/gdprCode';
// import interstitialScript from 'helpers/interstitial/interstitialDesktop';
import config from '../config';
import { TOI_LIVE_DOMAIN, GEOAPI_URL, dimensionMapping } from '../constants';
import { comscoreCodeObject, gaParams, tpsdk } from '../helpers/analytics';
import { MetaTags } from '../helpers/seo';

/* eslint-disable react/no-danger */

class Html extends React.Component {
  static propTypes = {
    styles: PropTypes.arrayOf(PropTypes.string.isRequired),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    app: PropTypes.shape({}).isRequired,
    children: PropTypes.string.isRequired,
    seoData: PropTypes.shape({}),
    singleURL: PropTypes.bool.isRequired,
    preconnectDomains: PropTypes.arrayOf({}),
    nsShowMaxCount: PropTypes.number,
    isPrime: PropTypes.bool,
    gtmID: PropTypes.string,
    multipublish: PropTypes.bool,
    skipGpt: PropTypes.bool,
    shiftGutter: PropTypes.bool,
    headTags: PropTypes.arrayOf(PropTypes.element),
    preloadFontFamily: PropTypes.arrayOf(PropTypes.string),
    skipPageViewGAOnLoad: PropTypes.bool,
    skipColumbiaScript: PropTypes.bool,
    prevNextLinkForBot: PropTypes.shape({}),
  };

  static defaultProps = {
    styles: [],
    multipublish: false,
    scripts: [],
    seoData: {},
    preconnectDomains: [],
    nsShowMaxCount: 0,
    isPrime: false,
    gtmID: undefined,
    skipGpt: false,
    shiftGutter: false,
    headTags: undefined,
    preloadFontFamily: [],
    skipPageViewGAOnLoad: false,
    skipColumbiaScript: false,
    prevNextLinkForBot: undefined,
  };
  render() {
    const {
      seoData,
      multipublish,
      styles,
      scripts,
      preloadFontFamily,
      app = {
        state: {},
      },
      children,
      singleURL,
      preconnectDomains,
      nsShowMaxCount,
      isPrime,
      gtmID,
      skipGpt,
      shiftGutter,
      headTags,
      skipPageViewGAOnLoad,
      skipColumbiaScript,
      prevNextLinkForBot,
    } = this.props;
    const seoDataKeywordsArray =
      seoData.keywords && seoData.keywords.split(',');
    if (seoDataKeywordsArray && seoDataKeywordsArray.length > 1)
      seoDataKeywordsArray.forEach((value, index) => {
        seoDataKeywordsArray[index] = value.trim();
      });
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"
          />
          <MetaTags
            data={seoData}
            multipublish={multipublish}
            mobile={app.state.isMobile}
            singleURL={singleURL}
            preconnectDomains={preconnectDomains}
            prevNextLinkForBot={prevNextLinkForBot}
          />
          <link rel="manifest" href="/pn_manifest.cms?v=1" />
          <link
            rel="apple-touch-icon"
            href={`${TOI_LIVE_DOMAIN}/icons/toifavicon.ico`}
          />
          <link
            rel="shortcut icon"
            href={`${TOI_LIVE_DOMAIN}/icons/toifavicon.ico`}
          />
          {styles.map((style) => (
            <link key={style} href={style} type="text/css" rel="stylesheet" />
          ))}
          {
            <>
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.nsShowMaxCount=${nsShowMaxCount}; window.isPrime=${isPrime}`,
                }}
              />
              {/* <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: interstitialScript,
                }}
              /> */}
            </>
          }
          {
            <>
              <script type="text/javascript" src={GEOAPI_URL} />
              {/* <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: gdprScriptString,
                }}
              /> */}
            </>
          }
          {config.analytics.googleTrackingId && (
            <script
              src="https://www.google-analytics.com/analytics.js"
              async
              //defer
            />
          )}
          <script dangerouslySetInnerHTML={comscoreCodeObject} />
          <script
            src="https://ade.clmbtech.com/cde/ae/2658/var=_ccaud"
            type="text/javascript"
            async
            //defer
          />
          {!skipGpt && (
            <script
              src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
              type="text/javascript"
              async
              //defer
            />
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                   window.updateDFPBidValue = (bidvalue, dfpslot, colombiadcontainerid, key) => {
                    console.log("updateDFPBidValue called");
                   window.dfpCanqueue=[];
                   window.dfpCanqueue.push({
                    bidvalue:bidvalue,
                    dfpslot:dfpslot,
                    colombiadcontainerid:colombiadcontainerid,
                    key:key
                   })
               };
             }`,
            }}
          />
          {headTags instanceof Array &&
            headTags.filter((item) => React.isValidElement(item))}
          {!skipColumbiaScript && (
            <script
              src="https://static.clmbtech.com/ad/commons/js/colombia_test.js"
              type="text/javascript"
              async
              //defer
            />
          )}
          {preloadFontFamily &&
            preloadFontFamily.length > 0 &&
            preloadFontFamily.map((font) => (
              <link
                rel="preload"
                href={`/fonts/${font}.woff2`}
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
              />
            ))}
        </head>
        <body>
          {shiftGutter && (
            <div className="appgutter">
              <div id="TOI_appgutter" />
            </div>
          )}
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `if(document.domain.indexOf('indiatimes.com') >= 0){document.domain = 'indiatimes.com';}
              if(document.domain.indexOf('timesofindia.com') >= 0){document.domain = 'timesofindia.com';}`,
            }}
          />
          {/* <script
            src="https://connect.facebook.net/en_US/fbadnw60-tag.js"
            async
            defer
          /> */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(g, r, o, w, t, h, rx) {
                    g[t] = g[t] || function() {
                        (g[t].q = g[t].q || []).push(arguments)
                    }, g[t].l = 1 * new Date();
                    g[t] = g[t] || {}, h = r.createElement(o), rx = r.getElementsByTagName(o)[0];
                    h.async = 1;
                    h.src = w;
                    rx.parentNode.insertBefore(h, rx)
                })(window, document, 'script', 'https://static.growthrx.in/js/v2/web-sdk.js', 'grx');
                grx('init', '${__PROD__ ? 'g7af6dd9d' : 'g3bf3e414'}');
                window.seoMetaKeywords = ${JSON.stringify(
                  seoDataKeywordsArray,
                )};
                `,
            }}
          />
          {config.analytics.googleTrackingId && (
            <script
              dangerouslySetInnerHTML={{
                __html:
                  `${
                    'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
                    `ga('create','${config.analytics.googleTrackingId}','auto'${
                      app.state.isMobile ? ',{"useAmpClientId": true}' : ''
                    });${gtmID ? `ga('require', '${gtmID}');` : ''}` +
                    `var __ssoid = document.cookie.match(/(?:\\s)?ssoid=(\\w+);?/);` +
                    `var __prc = document.cookie.match(/(?:\\s)?prc=(\\w+);?/);` +
                    `if(!!(__ssoid)) { ` +
                    `ga('set', 'userId', __ssoid[1]);` +
                    `grx('userId', __ssoid[1]);` +
                    `ga('set', 'dimension21', 1);` +
                    `grx('set', '${dimensionMapping.dimension21}', 1);` +
                    `ga('set', 'dimension22', __ssoid[1]);` +
                    `grx('set', '${dimensionMapping.dimension22}', __ssoid[1]);` +
                    `ga('set', 'dimension10', ((__prc && __prc[1]) ? __prc[1] : 0));` +
                    `grx('set', '${dimensionMapping.dimension10}', ((__prc && __prc[1]) ? __prc[1] : 0));}` +
                    `else {` +
                    `ga('set', 'dimension21', 0);` +
                    `grx('set', '${dimensionMapping.dimension21}', 0);` +
                    `ga('set', 'dimension10', -1);` +
                    `grx('set', '${dimensionMapping.dimension10}', -1); }` +
                    `ga('require', 'linker');` +
                    `ga('linker:autoLink', ['indiatimes.com', 'gocricket.com'],true );` +
                    `ga('require', 'displayfeatures');`
                  }${
                    gaParams.__html
                  }if (window.TimesGA && window.TimesGA.setGAParams) {window.TimesGA.setGAParams({}, true)}` +
                  `if (window.TimesGDPR && TimesGDPR.common.consentModule.gdprCallback) {
                    TimesGDPR.common.consentModule.gdprCallback(function(dataObj) {
                      if (dataObj.isEUuser) {
                        ga("set", "anonymizeIp", true);
                      }
                      ${!skipPageViewGAOnLoad ? 'ga("send", "pageview");' : ''}
                    });
                  } else {
                    ga("set", "anonymizeIp", true);
                    ${!skipPageViewGAOnLoad ? 'ga("send", "pageview");' : ''}
                  }
                  ${
                    !skipPageViewGAOnLoad
                      ? "grx('track', 'page_view', {url: window.location.href, keywords: window.seoMetaKeywords})"
                      : ''
                  }
                  `,
              }}
            />
          )}
          <script dangerouslySetInnerHTML={tpsdk} />
          {scripts.map((script) => (
            <script key={script} src={script} />
          ))}
          <script
            src="https://timesofindia.indiatimes.com/video_comscore_api/version-3.cms"
            type="text/javascript"
            defer
          />
          {/* <script
            type="text/javascript"
            src="https://jssocdn.indiatimes.com/crosswalk/jsso_crosswalk_legacy_0.1.9.min.js"
          />
          <script
            type="text/javascript"
            src="https://www.google.com/recaptcha/api.js"
            async="true"
            defer="true"
          /> */}
        </body>
      </html>
    );
  }
}

export default Html;
