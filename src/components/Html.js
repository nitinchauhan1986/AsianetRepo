import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
// import { gdprScriptString } from 'helpers/gdpr/gdprCode';
// import interstitialScript from 'helpers/interstitial/interstitialDesktop';
import config from '../config';
import {
  TOI_LIVE_DOMAIN,
  GEOAPI_URL,
  dimensionMapping,
  CLMB_WEB_CID,
  CLMB_MWEB_CID,
} from '../constants';
import { comscoreCodeObject, gaParams, tpsdk } from '../helpers/analytics';
import { MetaTags } from '../helpers/seo';
import webvitals from '../helpers/webvitals/webvitals';

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
    // isPrime: PropTypes.bool,
    gtmID: PropTypes.string,
    multipublish: PropTypes.bool,
    skipGpt: PropTypes.bool,
    // shiftGutter: PropTypes.bool,
    headTags: PropTypes.arrayOf(PropTypes.element),
    preloadFontFamily: PropTypes.arrayOf(PropTypes.string),
    skipPageViewGAOnLoad: PropTypes.bool,
    skipColumbiaScript: PropTypes.bool,
    prevNextLinkForBot: PropTypes.shape({}),
    isMaxImagePreview: PropTypes.bool,
    isMaxVideoPreview: PropTypes.bool,
    showPreload: PropTypes.bool,
    imageInfo: PropTypes.shape([]),
    // gutterType: PropTypes.string,
    skipImaScript: PropTypes.bool,
    skipPubmaticScript: PropTypes.bool,
  };

  static defaultProps = {
    styles: [],
    multipublish: false,
    scripts: [],
    seoData: {},
    preconnectDomains: [],
    nsShowMaxCount: 0,
    // isPrime: false,
    gtmID: undefined,
    skipGpt: false,
    // shiftGutter: true,
    headTags: undefined,
    preloadFontFamily: [],
    skipPageViewGAOnLoad: false,
    skipColumbiaScript: false,
    prevNextLinkForBot: undefined,
    isMaxImagePreview: false,
    isMaxVideoPreview: false,
    showPreload: false,
    imageInfo: [],
    // gutterType: false,
    skipImaScript: false,
    skipPubmaticScript: false,
  };
  render() {
    const {
      seoData,
      multipublish,
      isMaxImagePreview,
      isMaxVideoPreview,
      styles,
      scripts,
      preloadFontFamily,
      app = {
        state: {},
      },
      children,
      singleURL,
      preconnectDomains,
      // nsShowMaxCount,
      gtmID,
      skipGpt,
      headTags,
      skipPageViewGAOnLoad,
      // skipColumbiaScript,
      prevNextLinkForBot,
      showPreload,
      imageInfo,
      // skipImaScript,
      skipPubmaticScript,
      // gutterType,
    } = this.props;
    console.log('Nitin', styles);
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
            isMaxImagePreview={isMaxImagePreview}
            isMaxVideoPreview={isMaxVideoPreview}
            mobile={app.state.isMobile}
            singleURL={singleURL}
            preconnectDomains={preconnectDomains}
            prevNextLinkForBot={prevNextLinkForBot}
          />
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
          {styles.map((style) => (
            <link rel="preload" href={style} as="style" type="text/css" />
          ))}
          {showPreload &&
            imageInfo instanceof Array &&
            imageInfo.map((href) => (
              <link rel="preload" as="image" href={href} />
            ))}
          {styles.map((style) => (
            <link key={style} href={style} type="text/css" rel="stylesheet" />
          ))}
          <link rel="manifest" href="/pn_manifest.cms?v=1" />
          <link
            rel="apple-touch-icon"
            href="https://static.asianetnews.com/v1/icons/favicon.ico"
          />
          <link
            rel="shortcut icon"
            href="https://static.asianetnews.com/v1/icons/favicon.ico"
          />
          {/* {styles.map(style => (
            <link key={style} href={style} type="text/css" rel="stylesheet" />
          ))} */}

          {
            <>
              <script type="text/javascript" src={GEOAPI_URL} />
            </>
          }
          {!skipGpt && (
            <script
              src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
              type="text/javascript"
              async
              defer
            />
          )}
          {headTags instanceof Array &&
            headTags.filter((item) => React.isValidElement(item))}

          {/* {preloadFontFamily &&
            preloadFontFamily.length > 0 &&
            preloadFontFamily.map(font => (
              <link
                rel="preload"
                href={`/fonts/${font}.woff2`}
                as="font"
                type="font/woff2"
                crossOrigin="anonymous"
              />
            ))} */}
          <script
            dangerouslySetInnerHTML={{
              __html: `function ccaudjs() {
                var ismob = ${app.state.isMobile};
                var clientId = (ismob==true)?"cid=${CLMB_MWEB_CID}&":"cid=${CLMB_WEB_CID}&";
                var dsmi="", _fpc="", _optout="";
                var cookie = document.cookie.match('(^|;)\\s* ' + "_col_ccds" + '\\s*=\\s*([^;]+)')?.pop() || '';
                var fpccookie = document.cookie.match('(^|;)\\s* ' + "_col_uuid" + '\\s*=\\s*([^;]+)')?.pop() || '';
                var optoutcookie = document.cookie.match('(^|;)\\s* ' + "optout" + '\\s*=\\s*([^;]+)')?.pop() || '';
                if(!!cookie) {
                      dsmi = "dsmi=" + cookie + "&";
                }
                if(!!fpccookie) {
                    _fpc = "fpc=" + fpccookie + "&";
                }
                if(!!optoutcookie) {
                    _optout = "optout=" + optoutcookie + "&";
                }
                var url = "https://ade.clmbtech.com/cde/aef/var=colaud?"+clientId+dsmi+_fpc+_optout+"_u="+encodeURIComponent(window.location.href);
                var gtmdmp = document.createElement('script');
                gtmdmp.type = 'text/javascript';
                gtmdmp.async = true;
                gtmdmp.src = url;
                var s = document.getElementsByTagName('head')[0];
                s.parentNode.insertBefore(gtmdmp, s)
                setTimeout(function(){dumpAudsToLocalStorage()},5000);
              }
              function dumpAudsToLocalStorage() {
                if(typeof localStorage != "undefined" && typeof colaud != "undefined" && colaud.aud != ""){
                  localStorage.setItem('colaud', colaud.aud);
                }
              }
              setTimeout(function(){ccaudjs()},5000);`,
            }}
            type="text/javascript"
            defer
          />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
          />
          {config.analytics.googleTrackingId && (
            <script src="https://www.google-analytics.com/analytics.js" defer />
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                   window.updateDFPBidValue = function (bidvalue, dfpslot, colombiadcontainerid, key) {
                   window.dfpCanqueue=window.dfpCanqueue || [];
                   window.dfpCanqueue.push({
                    bidvalue:bidvalue,
                    dfpslot:dfpslot,
                    colombiadcontainerid:colombiadcontainerid,
                    key:key
                   });
                  var canDfpAdQueue = new Event('CAN_DFP_QUEUE');
                  window.dispatchEvent(canDfpAdQueue);
               };
             }`,
            }}
          />

          {/* {!skipImaScript && (
            <script
              type="text/javascript"
              src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
              defer
            />
          )} */}
          {/* <script
            type="text/javascript"
            src="https://tvid.in/sdk/loader.js"
            defer
          /> */}
          {/* <script
            src="https://connect.facebook.net/en_US/fbadnw60-tag.js"
            async
            defer
          /> */}
          {/* <script
            type="text/javascript"
            src="https://ade.clmbtech.com/cde/ae/2658/var=_ccaud"
            defer
          /> */}

          {config.analytics.googleTrackingId && (
            <script
              dangerouslySetInnerHTML={{
                __html:
                  `${
                    'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
                    `ga('create','${
                      config.analytics.googleTrackingId
                    }','auto',{'allowLinker': true,'useAmpClientId': true , cookieFlags: 'secure;samesite=none'});${
                      gtmID ? `ga('require', '${gtmID}');` : ''
                    }` +
                    `var __ssoid = document.cookie.match(/(?:\\s)?ssoid=(\\w+);?/);` +
                    `var __prc = document.cookie.match(/(?:\\s)?prc=(\\w+);?/);` +
                    `if(!!(__ssoid)) { ` +
                    `ga('set', 'userId', __ssoid[1]);` +
                    `grx('userId', __ssoid[1]);` +
                    `ga('set', 'dimension21', 1);` +
                    `grx('set', '${dimensionMapping.dimension21}', 1);` +
                    `if(typeof window !== 'undefined'  && window.sessionStorage && sessionStorage.getItem('planName')) { ` +
                    `ga('set', 'dimension33',sessionStorage.getItem('planName'));` +
                    `grx('set', '${dimensionMapping.dimension33}', sessionStorage.getItem('planName'));` +
                    `}` +
                    `ga('set', 'dimension22', __ssoid[1]);` +
                    `grx('set', '${dimensionMapping.dimension22}', __ssoid[1]);` +
                    `ga('set', 'dimension10', ((__prc && __prc[1]) ? __prc[1] : 0));` +
                    `grx('set', '${dimensionMapping.dimension10}', ((__prc && __prc[1]) ? __prc[1] : '0'));}` +
                    `else {` +
                    `ga('set', 'dimension21', 0);` +
                    `grx('set', '${dimensionMapping.dimension21}', 0);` +
                    `if(typeof window !== 'undefined'  && window.sessionStorage && sessionStorage.getItem('planName')) { ` +
                    `ga('set', 'dimension33', sessionStorage.getItem('planName'));` +
                    `grx('set', '${dimensionMapping.dimension33}',sessionStorage.getItem('planName'));` +
                    `}` +
                    `ga('set', 'dimension10', -1);` +
                    `grx('set', '${dimensionMapping.dimension10}', '-1'); }` +
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
                  `,
              }}
            />
          )}

          <script dangerouslySetInnerHTML={tpsdk} />
          {scripts.map((script) => (
            <script key={script} src={script} defer />
          ))}
          {!skipPubmaticScript && (
            <script
              src="https://ads.pubmatic.com/AdServer/js/pwt/23105/2338/pwt.js"
              type="text/javascript"
              defer
            />
          )}
          <script dangerouslySetInnerHTML={comscoreCodeObject} />
          <script
            src="https://timesofindia.indiatimes.com/video_comscore_api/version-3.cms"
            type="text/javascript"
            defer
          />
          {app.state.isMobile ? (
            <script
              src="https://m.timesofindia.com/grxpushnotification_js/minify-1,version-1.cms"
              type="text/javascript"
              defer
            />
          ) : (
            <script
              src="https://timesofindia.indiatimes.com/grxpushnotification_js/minify-1,version-1.cms"
              type="text/javascript"
              defer
            />
          )}

          <script
            async
            defer
            crossOrigin="anonymous"
            src="https://connect.facebook.net/en_US/sdk.js"
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `if(${app.state.isMobile} ){
                  function loadScriptWebVitals(file){
                    const jsElm = window.document.createElement('script');
                    jsElm.type = 'application/javascript';
                    jsElm.src = file;
                    window.document.body.appendChild(jsElm);
                  }
                  loadScriptWebVitals('${webvitals.webVitalsPkgURL}')
                }`,
            }}
          />
        </body>
      </html>
    );
  }
}

export default Html;
