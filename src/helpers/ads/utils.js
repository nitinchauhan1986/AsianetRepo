// import { gaWrapper } from 'helpers/analytics';
import Cookie from '../../utils/cookies';

export function getArticleShowMrecFanAdCode(index) {
  switch (index) {
    case 1: {
      return {
        placementId: '327541940615355_2416390551730473',
        size: '300x250',
      };
    }
    default: {
      return {
        placementId: '327541940615355_2416392701730258',
        size: '300x250',
      };
    }
  }
}
export function getAtfFanAdCode() {
  return {
    size: '300x250',
    placementId: '327541940615355_2433755636660631',
  };
}
export function getFbnFanAdCode() {
  return {
    size: '320x50',
    placementId: '327541940615355_2433757486660446',
  };
}

export function setAdsConfig(data) {
  if (data && typeof data === 'object' && typeof window === 'object') {
    window.Times = window.Times || {};
    window.Times.adsConfig = window.Times.adsConfig || {};
    window.Times.adsConfig.SubSCN = data.subSection || '';
  }
}

export function checkGeoHandling(cb) {
  if (window.TimesGDPR && window.TimesGDPR.common.consentModule.gdprCallback) {
    window.TimesGDPR.common.consentModule.gdprCallback(dataObj => {
      if (dataObj) {
        const geoinfo = { ...dataObj, userCountry: Cookie.get('geo_country') };
        if (typeof cb === 'function') {
          cb(geoinfo);
        }
      }
    });
  }
}

export function isMrecAds(adData = {}) {
  if (
    (adData.adType === 'dfp' || !adData.isCTN) &&
    typeof adData.adCode === 'string' &&
    adData.adCode
      .substring(adData.adCode.length - 4, adData.adCode.length)
      .toLowerCase() === 'mrec'
    //  ||
    // adData.adCode
    //   .substring(adData.adCode.length - 6, adData.adCode.length)
    //   .toLowerCase() === 'mrec_1'
  ) {
    return true;
  }
  return false;
}

/* export function attachAdDifferenceCalculationAnalytics(pageType) {
  const templateName =
    typeof pageType === 'string' ? pageType.toLowerCase() : 'undefined';
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  function checkAndFireAdDifferenceGa(eventAction, dfpEvent) {
    const slotPath = dfpEvent.slot.getAdUnitPath();
    const isAtf = slotPath.toLowerCase().indexOf('atf') >= 0;
    const isFbn = slotPath.toLowerCase().indexOf('fbn') >= 0;
    if (isAtf || isFbn) {
      gaWrapper(
        'send',
        'event',
        'ADS_Difference',
        eventAction,
        `${templateName}_${slotPath}`,
      );
    }
  }
  window.googletag.cmd.push(() => {
    window.googletag.pubads().addEventListener('slotRequested', event => {
      checkAndFireAdDifferenceGa('ad_requested', event);
    });
  });
  window.googletag.cmd.push(() => {
    window.googletag.pubads().addEventListener('slotRenderEnded', event => {
      checkAndFireAdDifferenceGa('ad_displayed', event);
    });
  });
} */
