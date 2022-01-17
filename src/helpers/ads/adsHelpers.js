import isMobile from 'utils/isMobile';
import Cookie from '../../utils/cookies';

const debugLogs = (logStr, val) => {
  if (
    typeof window === 'object' &&
    window.location.href.indexOf('debugLogs=1') > -1
  ) {
    console.log(logStr, val);
  }
};
let targetSlot = '';
// let colombiadcontainerId = '';

// eslint-disable-next-line func-names
const _tval = function(v) {
  if (typeof v === 'undefined') return '';
  if (v.length > 100) return v.substr(0, 100);
  return v;
};

const createAdObjectMap = adsArray => {
  if (Array.isArray(adsArray) && adsArray.length > 0) {
    let counter = 0;
    window.Times = window.Times || {};
    window.Times.adNameMap = window.Times.adNameMap || {};
    for (; counter < adsArray.length; counter += 1) {
      if (adsArray[counter].adName) {
        window.Times.adNameMap[adsArray[counter].adCode] = adsArray[counter];
      }
    }
  }
};

function dpfCanInit() {
  if (window.dfpCanqueue && window.dfpCanqueue.length > 0) {
    window.dfpCanqueue.forEach(ele => {
      const { dfpslot, colombiadcontainerid, key, bidvalue } = ele;
      // TO DO size and device type should be feed driven
      const adObj = {
        adCode: dfpslot,
        size: [300, 250],
        divId: colombiadcontainerid,
        prebid: false,
        targetingInfo: { dfpCanAd: { key, bidvalue } },
        deviceType: 'mobile',
      };
      const canDfpAd = new Event('CAN_DFP');
      canDfpAd.adObject = adObj;
      window.dispatchEvent(canDfpAd);
      // colombiadcontainerId = colombiadcontainerid;
    });
    window.dfpCanqueue = [];
    // clearInterval(timer);
  }
}
function dfpCanEventListener() {
  if (typeof window !== 'undefined') {
    window.addEventListener('CAN_DFP_QUEUE', dpfCanInit);
  }
}
dfpCanEventListener();
// if (typeof window !== 'undefined') {
//   const timer = setInterval(() => {
//     dpfCanInit(timer);
//   }, 1000);
//   // setTimeout(() => {
//   //   clearInterval(timer);
//   // }, 8000);
// }

function addSlotRequestedEvent() {
  if (window.slotRequestEvent === '1') {
    return;
  }
  try {
    window.slotRequestEvent = '1';
    window.googletag.pubads().addEventListener('slotRenderEnded', event => {
      debugLogs('event.slot', event.slot.getSlotElementId());
      // targetSlot && debugLogs('event.target', targetSlot.getSlotElementId());
      if (event.slot === targetSlot) {
        if (event.isEmpty && window.colombia) {
          window.googletag.destroySlots([targetSlot]);
          // debugLogs('colombiadcontainerid10', colombiadcontainerId);
          debugLogs('colombiadcontainerid11', targetSlot.getSlotElementId());
          window.colombia.setdfpstatus('fail', targetSlot.getSlotElementId());
        } else {
          // debugLogs('colombiadcontainerid20', colombiadcontainerId);
          debugLogs('colombiadcontainerid21', targetSlot.getSlotElementId());
          window.colombia.setdfpstatus(
            'success',
            targetSlot.getSlotElementId(),
          );
        }
        targetSlot = '';
      } else {
        const adSlot = event.slot.getAdUnitPath();
        let foundAdObject;
        if (
          window.Times &&
          window.Times.adNameMap &&
          window.Times.adNameMap[adSlot]
        ) {
          foundAdObject = window.Times.adNameMap[adSlot];
          // for (let i = 0; i < adsArray.length; i += 1) {
          //   if (adsArray[i].adCode === adSlot) {
          //     foundAdObject = adsArray[i];
          //     break;
          //   }
          // }
        }
        if (foundAdObject && foundAdObject.adName && !event.isEmpty) {
          document.body.classList.add(foundAdObject.adName);
        }
        if (foundAdObject && foundAdObject.adName === 'gutter') {
          if (event.isEmpty && foundAdObject.fallback) {
            const setGutterFallbackEvent = new Event('SET_GUTTER_FALLBACK');
            setGutterFallbackEvent.showGutterFallback = true;
            setGutterFallbackEvent.gutterFallbackAdObject =
              foundAdObject.fallback;
            setGutterFallbackEvent.gutterFallbackAdObject.gutterFallback = true;
            window.gutterFallbackAdObject = foundAdObject.fallback;
            window.dispatchEvent(setGutterFallbackEvent);
            if (window.template === 'liveblog') {
              if (typeof Event === 'function') {
                // modern browsers
                window.dispatchEvent(new Event('resize'));
              } else {
                const el = window;
                const event1 = document.createEvent('HTMLEvents');
                event1.initEvent('resize', true, false);
                el.dispatchEvent(event1);
              }
            }
          }
        }
        window.dispatchEvent(new Event('GUTTER_ACTIVE_AD_TYPE'));
        const fallbackAds = window.gutterFallbackAdObject;
        if (
          fallbackAds &&
          ((fallbackAds.adCode && fallbackAds.adCode === adSlot) ||
            (fallbackAds.lhs && fallbackAds.lhs.adCode === adSlot) ||
            (fallbackAds.rhs && fallbackAds.rhs.adCode === adSlot))
        ) {
          // if (!document.body.classList.contains('bgImg') && !event.isEmpty) {
          //   document.body.classList.add('bgImg');
          // }
        }
      }
    });

    window.adsCallback = adtype => {
      if (typeof adtype !== 'undefined') {
        switch (adtype) {
          case 'gutter': {
            const gutterAdTypeHandling = new Event('GUTTER_AD_TYPE_HANDLING');
            window.dispatchEvent(gutterAdTypeHandling);
            break;
          }
          case 'gutterclose': {
            const gutterCloseAdTypeHandling = new Event(
              'GUTTER_CLOSE_AD_TYPE_HANDLING',
            );
            window.dispatchEvent(gutterCloseAdTypeHandling);
            break;
          }
          case 'expandoclose': {
            const expandCloseAdTypeHandling = new Event(
              'EXPAND_CLOSE_AD_TYPE_HANDLING',
            );
            window.dispatchEvent(expandCloseAdTypeHandling);
            break;
          }
          default:
            break;
        }
      }
    };
  } catch (e) {
    // console.log(e);
  }
}

function checkForGeoInfoInAd(defaultObj, geo, objName) {
  if (
    typeof geo === 'object' &&
    typeof window.geoinfo === 'object' &&
    typeof geo[objName] === 'object' &&
    geo[objName][window.geoinfo.CountryCode] instanceof Array
  ) {
    return geo[objName][window.geoinfo.CountryCode];
  }
  return defaultObj;
}

function initAdserver(forced, adsArray, targetDiv) {
  debugLogs('***** initAdserver 0', adsArray);
  debugLogs('event.targetDiv', targetDiv);
  if (targetDiv) {
    debugLogs('event.targetDiv inside', targetDiv);
    targetSlot = targetDiv;
    window.googletag.pubads().refresh([targetSlot]);
  } else if (
    (forced === true && window.initAdserverFlag !== true) ||
    (window.a9_BidsInit &&
      window.PWT.a9_BidsReceived &&
      window.PWT.ow_BidsReceived) ||
    ((!window.PWT.prebidOn || !window.a9_BidsInit) &&
      window.PWT.ow_BidsReceived)
  ) {
    window.initAdserverFlag = true;
    window.a9_BidsInit = false;
    window.PWT.a9_BidsReceived = false;
    window.PWT.ow_BidsReceived = false;
    window.PWT.adSlotsArr = [];
    if (Array.isArray(adsArray) && adsArray.length > 0) {
      debugLogs('***** initAdserver 1  Set false', adsArray);
      window.googletag.pubads().refresh(adsArray);
    } else {
      debugLogs('***** initAdserver 2 all Set false', adsArray);
      window.googletag.pubads().refresh();
    }
  }
}

function getCcaudData() {
  let _auds = '';
  if (typeof colaud !== 'undefined') {
    _auds = window.colaud.aud;
  } else if (
    typeof localStorage !== 'undefined' &&
    typeof localStorage.getItem('colaud') !== 'undefined' &&
    localStorage.getItem('colaud') !== null
  ) {
    _auds = localStorage.getItem('colaud');
  }
  return _auds;
}

function pushAdSlotsToInitArr(adSlots) {
  window.PWT.adSlotsArr = window.PWT.adSlotsArr || [];
  window.PWT.adSlotsArr = window.PWT.adSlotsArr.concat(adSlots);
}

export function doPubmaticBidding(adSlotsArr) {
  // OpenWrap code START here
  debugLogs('***** doPubmaticBidding 0');
  if (typeof window.PWT.requestBids === 'function') {
    debugLogs('***** doPubmaticBidding 1', adSlotsArr);
    window.PWT.requestBids(
      window.PWT.generateConfForGPT(adSlotsArr),
      adUnitsArray => {
        window.PWT.addKeyValuePairsToGPTSlots(adUnitsArray);
        window.PWT.ow_BidsReceived = true;
        debugLogs(
          '****** doPubmaticBidding inner',
          adUnitsArray,
          adSlotsArr,
          'window.PWT.ow_BidsReceived',
          window.PWT.ow_BidsReceived,
        );
        pushAdSlotsToInitArr(adSlotsArr);
        initAdserver(false, window.PWT.adSlotsArr);
      },
    );
  }
}

// whenever you want header bids call this function
function fetchHeaderBids(apstagSlots) {
  // console.info('bidder func called');

  // get only gpt div id's that match slotIDs passed in fetchBids request
  function _getGPTSlots(apstags) {
    // get all of the slot IDs that were requested
    const slotIDs = apstags.map(slot => slot.slotID);
    // return the slot objects corresponding to the gpt slotIDs
    return window.googletag
      .pubads()
      .getSlots()
      .filter(
        slot =>
          // return true if the ID of the slot object is in the gpt slotIDs array
          slotIDs.indexOf(slot.getSlotElementId()) > -1,
      );
  }

  function doAmazonHeaderBidding(apstagSlotsArr) {
    const gptSlotsToRefresh = _getGPTSlots(apstagSlotsArr);
    if (gptSlotsToRefresh && gptSlotsToRefresh.length > 0) {
      window.a9_BidsInit = true;
      window.googletag.cmd.push(() => {
        window.apstag.fetchBids(
          {
            slots: gptSlotsToRefresh,
          },
          // eslint-disable-next-line no-unused-vars
          bids => {
            window.apstag.setDisplayBids();
            window.PWT.a9_BidsReceived = true;
            debugLogs(
              '****** doAmazonHeaderBidding inner',
              apstagSlotsArr,
              'window.PWT.a9_BidsReceived',
              window.PWT.a9_BidsReceived,
            );
            pushAdSlotsToInitArr(gptSlotsToRefresh);
            initAdserver(false, window.PWT.adSlotsArr);
          },
        );
      });
    }
  }

  // set timeout to send request to call sendAdserverRequest() after timeout
  // if all bidders haven't returned before then
  doAmazonHeaderBidding(apstagSlots);
}

export const displayAllAdsInArray = (adsArray, refreshableAdsList, path) => {
  const isWapView = isMobile();
  if (typeof window !== 'object') {
    return;
  }
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  const { googletag } = window;
  let globalHyp1 = '';
  let BL = 0;
  let _ARC1 = '';
  let dfpCanAd = '';
  const PPIDCookieVal = Cookie.get('_col_uuid');
  const PPIDFlag = PPIDCookieVal ? 'true' : 'false';
  const apstagSlots = [];
  const definedSlots = [];
  let targetDiv = '';

  let enableMraLazyLoadAds = false;
  if (
    (window.location.pathname === '/us-testads' &&
      window.location.search.indexOf('test=true') > -1) ||
    (window.location.pathname === '/us' &&
      window.location.search.indexOf('mratest=true') > -1)
  ) {
    enableMraLazyLoadAds = true;
  }
  window.googletag.cmd.push(() => {
    if (window.TimesGDPR) {
      window.TimesGDPR.common.consentModule.gdprCallback(dataObj => {
        if (dataObj.isEUuser && dataObj.didUserOptOut === false) {
          //user has has given consent for personalised ads ( i.e did not opt out )
          window.googletag.pubads().setRequestNonPersonalizedAds(0);
        } else if (dataObj.isEUuser) {
          window.googletag.pubads().setRequestNonPersonalizedAds(1);
        }
        createAdObjectMap(adsArray);
        addSlotRequestedEvent(adsArray);
      });
    }
    debugLogs('***** adsArray.forEach ', adsArray);
    // defining adslots below
    adsArray.forEach(adObject => {
      const {
        adCode,
        divId,
        hyp1,
        cookieKey,
        targetingInfo,
        callback,
        prebid,
        geo,
        // dfpParams = {},
      } = adObject;
      let { mlb } = adObject;
      let { size } = adObject;
      if (prebid) {
        apstagSlots.push({ slotID: divId, sizes: size, slotName: adCode });
      }
      globalHyp1 = hyp1 || globalHyp1;

      mlb = checkForGeoInfoInAd(mlb, geo, 'mlb');
      size = checkForGeoInfoInAd(size, geo, 'size');
      if (targetingInfo && typeof targetingInfo.dfpCanAd === 'object') {
        dfpCanAd = targetingInfo.dfpCanAd;
      }
      if (
        targetingInfo &&
        typeof targetingInfo._HYP1 === 'string' &&
        globalHyp1 !== targetingInfo._HYP1
      ) {
        globalHyp1 = targetingInfo._HYP1;
      }
      if (
        targetingInfo &&
        typeof targetingInfo.BL === 'number' &&
        BL !== targetingInfo.BL
      ) {
        BL = targetingInfo.BL;
      }
      if (
        targetingInfo &&
        typeof targetingInfo._ARC1 === 'string' &&
        _ARC1 !== targetingInfo._ARC1
      ) {
        _ARC1 = targetingInfo._ARC1;
      }
      if (
        typeof cookieKey === 'string' &&
        cookieKey.length > 0 &&
        Cookie.get(cookieKey)
      ) {
        return;
      }
      if (
        (isWapView && adObject.deviceType === 'mobile') ||
        (!isWapView && adObject.deviceType !== 'mobile') ||
        adObject.deviceType === 'all'
      ) {
        window.googletag.cmd.push(() => {
          if (!size) {
            if (googletag) {
              const googleTagOutOfPageSlot = googletag.defineOutOfPageSlot(
                adCode,
                divId,
              );
              if (googleTagOutOfPageSlot) {
                googleTagOutOfPageSlot.addService(googletag.pubads());
              }
              if (adObject.adType === 'gutter' && googleTagOutOfPageSlot) {
                window.gutterFallbackObj = googleTagOutOfPageSlot;
              }
            }
          } else {
            const adCodeObj = googletag.defineSlot(adCode, size, divId);
            if (adCodeObj) {
              definedSlots.push(adCodeObj);
            }
            if (PPIDCookieVal) {
              googletag.pubads().setPublisherProvidedId(PPIDCookieVal);
            }
            if (enableMraLazyLoadAds) {
              googletag.pubads().enableLazyLoad({
                // Fetch slots within 5 viewports.
                fetchMarginPercent: 100,
                // Render slots within 2 viewports.
                renderMarginPercent: 100,
                // Double the above values on mobile, where viewports are smaller
                // and users tend to scroll faster.
                mobileScaling: 2.0,
              });
            }
            const adSlotDefined = new CustomEvent('adSlotDefined', {
              detail: {
                adCode,
                adCodeObj,
                divId,
              },
            });
            window.dispatchEvent(adSlotDefined);
            if (adObject.gutterFallback) {
              window.gutterFallbackObj = adCodeObj;
            }
            // if (adCodeObj && dfpParams.doNotCollapse) {
            //   adCodeObj.setCollapseEmptyDiv(false);
            // }
            if (isWapView && adCodeObj && adCodeObj.setCollapseEmptyDiv) {
              adCodeObj.setCollapseEmptyDiv(false);
            }
            if (
              isWapView &&
              adCodeObj &&
              !(adCodeObj.mlb instanceof Array) &&
              size[0] instanceof Array &&
              size.length > 2 &&
              mlb !== 'no'
            ) {
              const mappingATF = googletag
                .sizeMapping()
                .addSize([1, 1], [320, 50])
                .addSize([480, 200], [468, 60])
                .addSize([768, 200], [728, 90])
                .build();
              adCodeObj.defineSizeMapping(mappingATF);
            }

            //Adding Size Mapping for Responsive Ads
            if (mlb && mlb.length > 0) {
              let mlbCodeObj;
              mlbCodeObj = googletag.sizeMapping();
              for (let j = 0; j < mlb.length; j += 1) {
                mlbCodeObj = mlbCodeObj.addSize(mlb[j][0], mlb[j][1]);
              }
              if (adCodeObj) {
                adCodeObj.defineSizeMapping(mlbCodeObj.build());
              }
            }
            if (adCodeObj) {
              adCodeObj.addService(googletag.pubads());
              if (dfpCanAd) {
                targetDiv = adCodeObj;
                // dfpCanAd = '';
              }
            }
            if (typeof callback === 'function') {
              callback(adCodeObj, divId, adObject);
            }
            if (adObject.refreshAd) {
              refreshableAdsList.push(adCodeObj);
            }
          }
        });
      }
    });
    debugLogs('**** apstagSlots', apstagSlots);
    if (apstagSlots.length > 0) {
      // define a universal timeout value
      // const bidTimeout = 2000;
      fetchHeaderBids(apstagSlots);
    }

    const _auds = getCcaudData() || [];
    const pubads = googletag.pubads();
    const altPath = path && path.length > 0 ? path.split('/') : [];
    let pathList = window.location.pathname.split('/');
    if (pathList.length === 0 || !pathList[1]) {
      pathList = ['default', 'home'];
    }
    const sectionName = altPath[1] || pathList[1];
    // targeting started
    pubads.setTargeting('sg', _auds);
    if (isWapView) {
      if (window.location.href.indexOf('.cms') >= 0) {
        const pathListforRpmId = [...pathList];
        const asIndex = pathListforRpmId.indexOf('articleshow');
        if (asIndex !== -1) {
          pathListforRpmId[asIndex] = 'articlestory';
        }
        pubads.setTargeting(
          '_rpmid',
          `${_tval(
            `${pathListforRpmId[pathListforRpmId.length - 2]}_${sectionName}`,
          )}`,
        );
      } else {
        pubads.setTargeting('_rpmid', `${_tval(pathList.join('_'))}`);
      }
      pubads.setTargeting('_category', _tval(pathList[1]));
    }
    pubads.setTargeting('aud_flag', PPIDFlag);
    if (PPIDFlag) {
      pubads.setTargeting('col_key', PPIDCookieVal);
    }
    if (typeof globalHyp1 === 'string' && globalHyp1 !== '') {
      pubads.setTargeting('hyp1', _tval(globalHyp1));
    }
    if (BL === 1) {
      //Porn Targeting
      pubads.setTargeting('BL', _tval(`${BL}`));
    }
    if (_ARC1) {
      //Porn Targeting
      pubads.setTargeting('ARC1', _tval(_ARC1));
    }
    pubads.setTargeting('SCN', _tval(sectionName));
    pubads.setTargeting(
      'Tmpl_SCN',
      `${pathList[pathList.length - 2]}_${sectionName}`,
    );
    if (
      typeof window === 'object' &&
      window.Times &&
      window.Times.adsConfig &&
      window.Times.adsConfig.SubSCN
    ) {
      pubads.setTargeting('SubSCN', window.Times.adsConfig.SubSCN);
    }
    // pubads.setTargeting('SubSCN', '');
    // pubads.setTargeting('Hyp1', '');
    pubads.setTargeting('fic', '0');
    pubads.setTargeting('SCP', '0');
    if (targetDiv) {
      targetDiv.setTargeting(dfpCanAd.key, dfpCanAd.bidvalue);
      dfpCanAd = '';
    }
    // targeting ended

    // googletag settings started
    if (!enableMraLazyLoadAds) {
      googletag.pubads().enableSingleRequest();
    }
    googletag.pubads().enableAsyncRendering();
    googletag.pubads().collapseEmptyDivs(true);
    googletag.enableServices();
    // googletag setting ended
    debugLogs('**** doPubmaticBidding before call', definedSlots);
    doPubmaticBidding(definedSlots);

    const FAILSAFE_TIMEOUT = 1000;
    debugLogs('event.targetDiv SET*******', targetDiv);
    setTimeout(() => {
      initAdserver(true, '', targetDiv);
    }, FAILSAFE_TIMEOUT);

    let displayCalled = false;
    // display calls for all ads are below
    adsArray.forEach(adObject => {
      if (
        ((isWapView && adObject.deviceType === 'mobile') ||
          (!isWapView && adObject.deviceType !== 'mobile') ||
          adObject.deviceType === 'all') &&
        !displayCalled
      ) {
        if (!enableMraLazyLoadAds) {
          displayCalled = true;
        }
        // if (apstagSlots.length > 0) {
        googletag.pubads().disableInitialLoad();
        // } else {
        // googletag.display(adObject.divId);
        // }
      }
    });
  });
};
