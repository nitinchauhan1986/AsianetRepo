import {
  clearDfpAdsFromRefreshableList,
  incrementAdsCounter,
} from 'helpers/ads/redux';
import analyticsWrapper from 'helpers/analytics/analyticsWrapper';
import { getCookie } from './cookies';
import {
  TOI_LIVE_DOMAIN,
  TOI_DEV_DOMAIN,
  TOI_DEV_MOBILE_DOMAIN,
  TOI_LIVE_MOBILE_DOMAIN,
  GOOGLE_WEBCACHE_DOMAIN,
  ACTIVE_PRIME_USER_PRC_ARR,
  PRC_FOR_FTU,
  MOB_DEFAULT_INTERSTITIAL_URL_PROD,
  MOB_DEFAULT_INTERSTITIAL_URL_DEV,
  MOB_DEFAULT_INTERSTITIAL_US_URL_DEV,
  MOB_DEFAULT_INTERSTITIAL_US_URL_PROD,
  IPL_MID_ARTICLE,
  PROMOTED_AMAZON_SLIDER,
} from '../constants';

export function debounce(func, wait, immediate) {
  let timeout;
  return function debouncer() {
    const context = this;
    const args = arguments;
    const later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
export const insertAtIndexInArray = (myArray, index, item) => {
  if (myArray instanceof Array) {
    myArray.splice(index, 0, item);
    return myArray;
  }
  return myArray;
};

export const getValueBeforeDecimal = numberStringWithCommas => {
  if (
    typeof numberStringWithCommas === 'string' &&
    numberStringWithCommas.indexOf('.') > -1
  ) {
    return numberStringWithCommas.substring(
      0,
      numberStringWithCommas.indexOf('.'),
    );
  }

  return numberStringWithCommas;
};

export function getSiteDomain(isMobile) {
  const isDev = !__PROD__;
  if (isMobile) {
    return isDev ? TOI_DEV_MOBILE_DOMAIN : TOI_LIVE_MOBILE_DOMAIN;
  }

  return isDev ? TOI_DEV_DOMAIN : TOI_LIVE_DOMAIN;
}

export function getMobDefaultInterstitialDomain() {
  const isDev = !__PROD__;
  return isDev
    ? MOB_DEFAULT_INTERSTITIAL_URL_DEV
    : MOB_DEFAULT_INTERSTITIAL_URL_PROD;
}
export function getUsMobDefaultInterstitialDomain() {
  const isDev = !__PROD__;
  return isDev
    ? MOB_DEFAULT_INTERSTITIAL_US_URL_DEV
    : MOB_DEFAULT_INTERSTITIAL_US_URL_PROD;
}

export function getNavigationPath(path, depth) {
  const navigationPath = path
    .split('/')
    .slice(0, depth + 1)
    .join('/');

  return navigationPath;
}
export function sanitizeQueryParams(paramsObj) {
  const sanitizedParamsObj = {};

  // loop through params keys, if value is array, pick its last value as param's value
  Object.keys(paramsObj).forEach(paramKey => {
    const paramValue = paramsObj[paramKey];
    if (Array.isArray(paramValue)) {
      sanitizedParamsObj[paramKey] = paramValue[paramValue.length - 1];
    } else {
      sanitizedParamsObj[paramKey] = paramValue;
    }
  });

  return sanitizedParamsObj;
}

export function disableAppInit() {
  return (
    window.location.hostname === GOOGLE_WEBCACHE_DOMAIN ||
    window.document.domain === GOOGLE_WEBCACHE_DOMAIN
  );
}

export function toQueryString(obj) {
  const parts = [];
  Object.keys(obj).forEach(i => {
    parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`);
  });
  return parts.join('&');
}

export function routeChangeHandlings(context, isInitialRender) {
  window.ctn_res = null;
  context.store.dispatch(clearDfpAdsFromRefreshableList());
  if (!isInitialRender) {
    context.store.dispatch(incrementAdsCounter());
  }
}
export function userVideoDataJson(oldData) {
  const updatedJson = { data: { items: [] } };
  if (oldData && oldData.data) {
    oldData.data.forEach(item => {
      if (item.msid) {
        let views = '';
        if (oldData.views && oldData.views.msid) {
          if (parseInt(oldData.views.msid, 10) === parseInt(item.msid, 10)) {
            views = oldData.views.viewed;
          }
        } else {
          const viewObj = oldData.views
            ? oldData.views.find(
                o => parseInt(o.msid, 10) === parseInt(item.msid, 10),
              )
            : null;
          views = (viewObj && viewObj.viewed) || '';
        }
        updatedJson.data.items.push({
          id: item.msid,
          hl: item.tet,
          imageid: item.msid,
          wu: item.teu,
          _id: item._id,
          views,
        });
      }
    });
  }
  return updatedJson;
}

export function rodate(time = '') {
  const getElapsedTime = (ctime, labels_config, last_only) => {
    if (typeof ctime !== 'number') {
      return '';
    }
    const labels_default = {
      year: 'year',
      day: 'day',
      hour: 'hour',
      minute: 'minute',
      second: 'second',
      ago: 'ago',
    };
    const labels = Object.assign({}, labels_default, labels_config);
    const timeparts = [
      {
        name: labels.year,
        div: 31536000000,
        mod: 10000,
      },
      {
        name: labels.day,
        div: 86400000,
        mod: 365,
      },
      {
        name: labels.hour,
        div: 3600000,
        mod: 24,
      },
      {
        name: labels.minute,
        div: 60000,
        mod: 60,
      },
      {
        name: labels.second,
        div: 1000,
        mod: 60,
      },
    ];
    let i = 0;
    const l = timeparts.length;
    let calc;
    const values = [];
    const interval = new Date().getTime() - ctime; //todo use server time
    while (i < l) {
      calc = Math.floor(interval / timeparts[i].div) % timeparts[i].mod;
      if (calc && calc >= 0) {
        values.push(`${calc} ${timeparts[i].name}${calc > 1 ? 's' : ''}`);
      }
      i += 1;
    }
    if (values.length === 0) {
      values.push(`1 ${labels.second}`);
    }
    if (last_only === true) {
      return `${values[0]} ${labels.ago}`;
    }
    return `${values.join(', ')} ${labels.ago}`;
  };

  let elapsedTime = '';

  let finalTime = time;
  if (typeof finalTime !== 'string') {
    finalTime = finalTime.toString();
  }
  let match = finalTime.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
  let rod = new Date(finalTime);

  if (!!finalTime && !match && Number.isNaN(rod.getTime())) {
    // console.log(finalTime);
    finalTime = !Number.isNaN(finalTime) ? parseInt(finalTime, 10) : finalTime;
    const timeObj = new Date(finalTime);
    if (!Number.isNaN(timeObj.getTime())) {
      rod = timeObj;
    } else if (typeof finalTime === 'string') {
      if (finalTime.indexOf('hrs IST') !== -1) {
        finalTime = finalTime.replace(' hrs IST', '');
        finalTime = finalTime.splice(-2, 0, ':'); //21 Apr, 2014, 16:31
      }
      finalTime = finalTime.replace('IST', '');
      finalTime = finalTime.replace('hrs', '');
      finalTime = finalTime.replace('AM', ' AM');
      finalTime = finalTime.replace('PM', ' PM');
      rod = new Date(finalTime);
      if (Number.isNaN(rod.getTime())) {
        if (finalTime.indexOf(':') > -1) {
          finalTime = finalTime.split(' ').join('T');
          finalTime = finalTime.concat('+05:30');
          rod = new Date(finalTime);
        }
      }
    }
  }
  match = [
    '',
    rod.getYear() + 1900,
    rod.getMonth() + 1,
    rod.getDate(),
    rod.getHours(),
    rod.getMinutes(),
    rod.getSeconds(),
  ];
  if (!!match && match instanceof Array && match.length >= 6) {
    elapsedTime = getElapsedTime(
      new Date(
        match[1],
        match[2] - 1,
        match[3],
        match[4],
        match[5],
        match[6],
      ).getTime(),
      {
        minute: 'min',
        second: 'sec',
      },
      true,
    );
  }

  return elapsedTime;
}

export function getClassesFromArray(styleArr, styleObj) {
  //classArr is array and checking length before processing
  if (styleArr.length) {
    const classArr = [];
    for (let i = 0; i < styleArr.length; i += 1) {
      classArr[i] = styleObj[styleArr[i]];
    }
    return classArr.join(' ');
  }
  return '';
}

export function getCustomClassesForPayload(classes, styleObj) {
  //Claases is string and checking length before processing
  if (classes.length) {
    const newClass = classes.replace(/  +/g, ' ');
    const classArr = newClass.split(' ');
    for (let i = 0; i < classArr.length; i += 1) {
      classArr[i] = styleObj[classArr[i]];
    }
    return classArr.join(' ');
  }
  return '';
}

export function preventCopy(isWapView, utm) {
  const d = document;
  const b = d.body;
  // const de = d.documentElement;
  // eslint-disable-next-line no-eval
  const C = eval('/*@cc_on!@*/false');
  const _ga_utm = `utm_source=contentofinterest&utm_medium=text&utm_campaign=${
    utm && utm.length > 0 ? utm : 'cppst'
  }`;
  let AE;
  // eslint-disable-next-line no-unused-vars
  let RE;
  // eslint-disable-next-line no-shadow
  const sp = (a, b) => {
    Object.assign(b, a);
    // for (const c in a) if (a.hasOwnProperty(c)) b[c] = a[c];
  };
  const bo = (a, be, c) => {
    const ae = d.createElement(a);
    sp(be, ae);
    sp(c, ae.style);
    return ae;
  };
  const tc = () => {
    let so;
    let st = '';
    const reg1 = /\w+/gi;
    let linkFlg = true;
    if (window._gaq) {
      window._gaq.push(['_trackEvent', 'cppst', 'select', 'cntntcp']);
    }
    if (d.selection && d.selection.createRange) {
      so = d.selection.createRange();
      st = so.htmlText;
      if (st.match(reg1) && st.match(reg1).length > 4) {
        linkFlg = true;
        st = st.replace(/(<a([^>]+)>)/gi, '');
        st = st.replace(/(<([^>]+)a>)/gi, '');
        st = st.length > 60 ? `${st.substring(0, 60)}&nbsp;..` : st;
        st = st.replace(/\n/gi, '<br />');
        st += '<br />';
      }
    } else {
      so = window.getSelection();
      st = so.toString();
      if (st.match(reg1) && st.match(reg1).length > 4) {
        if (so.rangeCount) {
          const container = bo(
            'div',
            { id: 'copiedTextClone' },
            { display: 'none' },
          );
          linkFlg = true;
          const len = so.rangeCount;
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < len; ++i) {
            container.appendChild(so.getRangeAt(i).cloneContents());
          }
          st = container.innerHTML;
          st = st.replace(/(<a([^>]+)>)/gi, '');
          st = st.replace(/(<([^>]+)a>)/gi, '');
          st = st.length > 60 ? `${st.substring(0, 60)}&nbsp;..` : st;
        }
      }
    }
    let lnkurl = window.location.href;
    const indx2 = lnkurl.indexOf('/articleshow');
    lnkurl = `http://${
      isWapView ? 'm.timesofindia.com' : 'timesofindia.indiatimes.com'
    }${lnkurl.substring(indx2, lnkurl.length)}`;
    lnkurl =
      // eslint-disable-next-line no-nested-ternary
      lnkurl.indexOf('?') === -1
        ? `${lnkurl}?${_ga_utm}`
        : lnkurl.indexOf(_ga_utm) === -1 ? `${lnkurl}&${_ga_utm}` : lnkurl;
    if (linkFlg) {
      const lnk = `<br /><br /><div style='font-size:12px;font-family:arial'>Read more at:<br /><a href='${lnkurl}'>${lnkurl}</a></div>`;
      st = `${st} ${lnk}`;
    }
    const e = bo(
      'div',
      {},
      { position: 'fixed', top: 0, left: '-99999px', background: '#fff' },
    );
    b.appendChild(e);
    e.innerHTML = st;
    if (so.selectAllChildren) {
      so.selectAllChildren(e);
    } else {
      const m = b.createTextRange();
      m.moveToElementText(e);
      m.select();
    }
    window.setTimeout(() => {
      b.removeChild(e);
    }, 0);
  };
  const ca = a => {
    // eslint-disable-next-line no-use-before-define
    SE();
    // eslint-disable-next-line no-unused-expressions
    d.readyState === 'complete'
      ? a()
      : AE(window, 'load', () => {
          setTimeout(() => {
            if (typeof d.readyState === 'undefined' && !C)
              d.readyState = 'complete';
            a();
          }, 10);
        });
  };
  let SE = () => {
    if (window.addEventListener) {
      AE = (a, be, c) => {
        a.addEventListener(be, c, false);
      };
      RE = (a, be, c) => {
        a.removeEventListener(be, c, false);
      };
    } else {
      AE = (a, be, c) => {
        a.attachEvent(`on${be}`, c);
      };
      RE = (a, be, c) => {
        a.detachEvent(`on${be}`, c);
      };
    }
  };
  const init = () => {
    if (window.addEventListener) {
      b.addEventListener('copy', tc);
    } else {
      b.attachEvent('oncopy', tc);
    }
  };
  return ca(init);
}

export function convertHtmlToStringText(cmt) {
  if (typeof document === 'undefined') {
    return cmt;
  }
  const elem = document.createElement('div');
  elem.innerHTML = cmt;
  return elem.innerText;
}

export function isTablet() {
  return (function returnAgent(agent) {
    return /(?:ipad|tab)/i.test(agent);
  })(navigator.userAgent || navigator.vendor || window.opera);
}

export function isLandscape() {
  if (typeof window !== 'undefined') {
    const mql = window.matchMedia('(orientation: landscape)');
    return mql.matches;
  }
  return false;
}

export function isIOS() {
  return (function returnAgent(agent) {
    return /iPhone|iPod|iPad/.test(agent);
  })(navigator.userAgent || navigator.vendor || window.opera);
}

export function isIE11() {
  return navigator.userAgent.match(/Trident.*rv[ :]*11\./);
}

export function isIE() {
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  const edge = ua.indexOf('Edge/') || ua.indexOf('Edg/'); //In latest versions of Edge 88+, comes Edg in ua
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

export function getBrowserName() {
  let browser = '';
  if (typeof window !== 'undefined') {
    const { userAgent } = navigator;
    console.log('====== userAgent : ', userAgent);
    if (isIE()) {
      browser = 'IE';
    } else if (
      userAgent.indexOf('Chrome') > -1 ||
      userAgent.indexOf('CriOS') > -1
    ) {
      browser = 'Chrome';
    } else if (userAgent.indexOf('Firefox') > -1) {
      browser = 'Firefox';
    } else if (userAgent.indexOf('Safari') > -1) {
      browser = 'Safari';
    } else if (
      userAgent.indexOf('Opera') > -1 ||
      userAgent.indexOf('OPR') > -1
    ) {
      browser = 'Opera';
    }
  }
  return browser;
}

export function inViewForReact(el, skew = 0, partial, roundValues) {
  const rect = el.getBoundingClientRect();
  let { top, bottom } = rect;
  let { height } = rect;
  let { left, right } = rect;
  if (roundValues) {
    top = Math.round(top);
    height = Math.round(height);
    left = Math.round(left);
    right = Math.round(right);
  }
  let isInView = false;
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  if (skew) {
    top = skew ? top + skew / 2 : top;
    bottom = skew ? bottom - skew / 2 : bottom;
  }

  if (partial) {
    isInView =
      (bottom > 0 && bottom <= windowHeight) ||
      (bottom > 0 && bottom < height) ||
      (top >= 0 && top <= windowHeight);
  } else {
    isInView =
      top >= 0 && left >= 0 && bottom <= windowHeight && right <= windowWidth;
  }
  return isInView;
}
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export function loadFacebookJs(onLoadCallback) {
  if (typeof document !== 'undefined') {
    if (typeof window.FB !== 'undefined') {
      if (typeof onLoadCallback === 'function') {
        onLoadCallback();
      }
      return;
    }
    const s = document.createElement('script');
    s.setAttribute('src', `//connect.facebook.net/en_US/sdk.js`);
    s.onload = () => {
      window.FB.init({
        appId: 117787264903013,
        oauth: false,
        status: false,
        cookie: true,
        xfbml: false,
        version: 'v2.12',
      });
      if (typeof onLoadCallback === 'function') {
        onLoadCallback();
      }
    };
    document.body.appendChild(s);
  }
}

export function getMsidFromPath(path) {
  let msid = '';
  if (typeof path === 'string' && path.length > 0) {
    const articlePathSplit = path.split('/');
    if (
      articlePathSplit &&
      articlePathSplit.length > 0 &&
      articlePathSplit[articlePathSplit.length - 1].includes('.cms')
    ) {
      msid = articlePathSplit[articlePathSplit.length - 1].split('.')[0];
    }
  }

  return msid;
}

export function getShortUrl(url, type, isMobile, disableShortUrl = false) {
  if (!url) {
    return '';
  }

  // TOIPR-54913 For sharing home page url without appending anything for budget
  if (disableShortUrl) {
    return url;
  }

  // this.utmCampaignM = 'j';
  //   this.utmCampaignD = 'k';
  const shortUrlMap = {
    fb: {
      utmSource: 'a23',
      medium: 'g',
    },
    twitter: {
      utmSource: 'a24',
      medium: 'g',
    },
    linkedin: {
      utmSource: 'a26',
      medium: 'g',
    },
    whatsapp: {
      utmSource: 'a31',
      medium: 'g',
    },
    whatsappfloating: {
      utmSource: 'a31',
      medium: 'g',
      campaign: 'a8',
    },
    email: {
      utmSource: 'a28',
      medium: 'g',
    },
    pinit: {
      utmSource: 'a27',
      medium: 'g',
    },
    nativeShare: {
      utmSource: 'a33',
      medium: 'g',
    },
  };

  const mapValue = shortUrlMap[type];
  if (!mapValue) {
    return url;
  }
  return `${url}/${mapValue.utmSource}${mapValue.medium}${mapValue.campaign ||
    (isMobile ? 'j' : 'k')}`;
}

export function getAuthors(authors) {
  let author = '';
  if (authors && authors.length > 0) {
    for (let i = 0; i < authors.length; i += 1) {
      author += authors[0].name;
      if (!author.length === 1 && i !== author.length - 1) {
        author += '&';
      }
    }
  }

  return author;
}

export function isPrimeUser() {
  const activePrimeUserPrcArr = ACTIVE_PRIME_USER_PRC_ARR;
  const prc = getCookie('prc');
  let prcVal = -1;
  if (prc && prc.length > 0) {
    prcVal = parseInt(prc.split('#')[0], 10);
  }
  if (
    typeof prcVal !== 'undefined' &&
    activePrimeUserPrcArr.indexOf(prcVal) > -1
  ) {
    return true;
  }
  return false;
}

export function isFTU() {
  const prc = getCookie('prc');
  let _isFTU = false;
  if (prc && prc.length > 0) {
    const prcVal = parseInt(prc.split('#')[0], 10);
    _isFTU = prcVal === PRC_FOR_FTU;
  }
  return _isFTU;
}

export function getSectionsListFromBreadCrumb(navData = []) {
  const subSectionsArray = [];
  for (let i = 0; i < navData.length; i += 1) {
    if (navData[i].id !== 'home' && navData[i].id !== 'title') {
      subSectionsArray.push(navData[i].label);
    }
  }
  return subSectionsArray;
}
export function getCustomDimension8(sectionsNameList = []) {
  // console.log('check the array ' + sectionsNameList.join('*'));
  if (sectionsNameList.length > 0) {
    if (sectionsNameList[0].toLowerCase() === 'videos' && sectionsNameList[1]) {
      return sectionsNameList[1];
    }
    return sectionsNameList[0];
  }
  return '';
}

export function disableBodyScroll() {
  const $body = document.getElementsByTagName('body')[0];
  let classList = $body.className;
  const classListArr = classList ? classList.split(' ') : [];
  if (classListArr.indexOf('disable-scroll') !== -1) {
    return;
  }
  classListArr.push('disable-scroll');
  classList = classListArr.join(' ');
  $body.className = classList;
}
export function enableBodyScroll() {
  const $body = document.getElementsByTagName('body')[0];
  let classList = $body.className;
  const classListArr = classList ? classList.split(' ') : [];
  const disableArrayIndex = classListArr.indexOf('disable-scroll');
  if (disableArrayIndex === -1) {
    return;
  }
  classListArr.splice(disableArrayIndex, 1);
  classList = classListArr.join(' ');
  $body.className = classList;
}
export function getDomainOnly(url) {
  return `.${(url || document.location.host)
    .split(':')[0]
    .split('.')
    .reverse()
    .slice(0, 2)
    .reverse()
    .join('.')}`;
}
export function isTouch() {
  return 'ontouchstart' in window || 'DocumentTouch' in window;
}

export function gtag() {
  window.dataLayer = window.dataLayer || [];

  if (window.dataLayer instanceof Array) {
    window.dataLayer.push(arguments);
  }
}

export function checkAndRedirectToHomePage(e) {
  const pageUrlPathName = window.location.pathname;
  if (pageUrlPathName === '/us') {
    e.preventDefault();
    window.location.href = pageUrlPathName;
    return false;
  }
  return true;
}

export function getQueryParams(paramName, url) {
  const { href = '' } = url || window.location;
  const reg = new RegExp(`[?&]${paramName}=([^&#]*)`, 'i');
  const queryString = reg.exec(href);
  return queryString ? queryString[1] : null;
}

export function getGeoBasesPerpectualNextLinkData(nextLinks) {
  let finalNextLinks = [];
  if (nextLinks && nextLinks.length > 0 && nextLinks instanceof Array) {
    if (window.geoinfo && window.geoinfo.CountryCode === 'US') {
      finalNextLinks = nextLinks.map(
        data => (data.geo && data.geo.US ? data.geo.US : data),
      );
    } else {
      finalNextLinks = nextLinks;
    }
  }
  return finalNextLinks;
}

export function getSkipAdsFlagForVideo(meta) {
  if (meta && meta.AdServingRules === 'Turnoff Video Ads') {
    return true;
  }
  return false;
}

export function isIPLMidArticleWidgetsPresent(articleshowData) {
  const { widgets } = articleshowData;
  let isIPLMidArticleWidgetPresent = false;
  if (widgets && widgets instanceof Array) {
    for (let i = 0; i < widgets.length; i += 1) {
      if (widgets[i] && widgets[i].tn === IPL_MID_ARTICLE) {
        isIPLMidArticleWidgetPresent = true;
        break;
      }
    }
  }
  return isIPLMidArticleWidgetPresent;
}

/**
 * function to get banner data
 * @param {*} widgets
 */
export function getBannerData(widgets) {
  let widget;
  for (let i = 0; i < widgets.length; i += 1) {
    if (widgets[i].tn === 'widget_election_banner') {
      widget = widgets[i];
      break;
    }
  }
  return widget;
}

export function isPromotedAmazonSlidersPresent(articleshowData) {
  const { widgets } = articleshowData;
  let isPromotedAmazonSliderPresent = false;
  if (widgets && widgets instanceof Array) {
    for (let i = 0; i < widgets.length; i += 1) {
      if (widgets[i] && widgets[i].tn === PROMOTED_AMAZON_SLIDER) {
        isPromotedAmazonSliderPresent = true;
        break;
      }
    }
  }
  return isPromotedAmazonSliderPresent;
}

/**
 * function to get query string value
 */
export function getParameterByName(name = '', url = window.location.href) {
  // const _name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  // const regex = new RegExp(`[?&]' + ${_name} + '(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * @param {*} el
 * Selected Element
 */
export function isScrolledIntoView(el) {
  const rect = el.getBoundingClientRect();
  const { top, bottom } = rect;

  // Only completely visible elements return true:
  // var isVisible = (elemTop >= 0 || elemBottom <= window.innerHeight);

  // Partially visible elements return true:
  const isVisible = top < window.innerHeight && bottom >= 0;
  return isVisible;
}

export function fireCustomDimension(value, dimension = 'dimension34') {
  analyticsWrapper('gaAndGrx', 'set', dimension, value);
}

export function sortByKey(array, key) {
  return array.sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (x < y) {
      return -1;
    } else if (x > y) {
      return 1;
    }
    return 0;
  });
}

export function isGoogleBot() {
  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.toLowerCase().indexOf('googlebot') > -1
  ) {
    return true;
  }

  return false;
}

export const debugLogs = (logStr, val) => {
  if (
    typeof window === 'object' &&
    window.location.href.indexOf('debugLogs=1') > -1
  ) {
    console.log(logStr, val);
  }
};

export const isSafari = () => {
  if (
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') === -1 &&
    navigator.userAgent.indexOf('FxiOS') === -1
  ) {
    return true;
  }
  return false;
};

const getDocHeight = () => {
  const D = document;
  return Math.max(
    D.body.scrollHeight,
    D.documentElement.scrollHeight,
    D.body.offsetHeight,
    D.documentElement.offsetHeight,
    D.body.clientHeight,
    D.documentElement.clientHeight,
  );
};

export const percentageScrolled = () => {
  const winheight =
    window.innerHeight ||
    (document.documentElement || document.body).clientHeight;
  const docheight = getDocHeight();
  const scrollTop =
    window.pageYOffset ||
    (document.documentElement || document.body.parentNode || document.body)
      .scrollTop;
  const trackLength = docheight - winheight;
  const pctScrolled = Math.floor(scrollTop / trackLength * 100);
  return pctScrolled;
};
