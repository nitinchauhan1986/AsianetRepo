import makeRequest from 'utils/makeRequest';
import _get from 'lodash.get';
import { debugLogs } from 'utils/common';
import { displayAllAdsInArray } from './adsHelpers';
import reducerRegistry from '../../reduxUtils/reducerRegistry';

const reducerName = 'adCaller';
const createActionName = name => `toi/${reducerName}/${name}`;
const adsCampaignConfig = {
  as_strip_ppd: 'PPD',
  top_band: 'FIXED',
  slug1_on_ros: 'SLUG1',
  slug2_on_ros: 'SLUG2',
  slug3_on_ros: 'SLUG3',
  slug4_on_ros: 'SLUG4',
};
// actions
export const ADD_TO_QUEUE = createActionName('ADD_TO_QUEUE');
export const LOAD_ALL_ADS_FROM_QUEUE = createActionName(
  'LOAD_ALL_ADS_FROM_QUEUE',
);
export const ADD_TO_REFRESHABLE_LIST = createActionName(
  'ADD_TO_REFRESHABLE_LIST',
);
export const REFRESH_ADS_FROM_REFRESHABLE_LIST = createActionName(
  'REFRESH_ADS_FROM_REFRESHABLE_LIST',
);
export const REFRESH_DFP_ADS_FROM_REFRESHABLE_LIST = createActionName(
  'REFRESH_DFP_ADS_FROM_REFRESHABLE_LIST',
);

export const CLEAR_DFP_ADS_FROM_REFRESHABLE_LIST = createActionName(
  'CLEAR_DFP_ADS_FROM_REFRESHABLE_LIST',
);
export const RECIEVE_ADS_CAMPAIGN = createActionName('RECIEVE_ADS_CAMPAIGN');

export const INCREMENT_ADS_COUNTER = createActionName('INCREMENT_ADS_COUNTER');

export const PREBID_CHECK = createActionName('PREBID_CHECK');

export const SET_PREBID_DATA = createActionName('SET_PREBID_DATA');

export const SET_GUTTER_FALLBACK = createActionName('SET_GUTTER_FALLBACK');

export const SET_PATH_NATIVE_CAMPAIGN = createActionName(
  'SET_PATH_NATIVE_CAMPAIGN',
);

export const RECIEVE_NATIVE_CAMPAIGN = createActionName(
  'RECIEVE_NATIVE_CAMPAIGN',
);

const RES_NATIVE_CAMPAIGN_SESSION_TIME_IN_MIN = 5;
const RES_NATIVE_CAMPAIGN_STORAGE_KEY = 'response_native_campaign';
// action creators
export function addToQueue(adObject) {
  return {
    type: ADD_TO_QUEUE,
    payload: {
      adObject,
    },
  };
}
export function incrementAdsCounter() {
  return {
    type: INCREMENT_ADS_COUNTER,
    payload: {},
  };
}

export function loadAllAdsFromQueue(divId, path) {
  return (dispatch, getState) => {
    const appState = getState();
    const state = appState[reducerName] || {};
    if (Array.isArray(state.adsQueueData) && state.adsQueueData.length > 0) {
      let refreshableAdsList = [];
      if (Array.isArray(state.refreshableAdsList)) {
        refreshableAdsList = state.refreshableAdsList;
      }
      displayAllAdsInArray(state.adsQueueData, refreshableAdsList, path);
      dispatch({
        type: LOAD_ALL_ADS_FROM_QUEUE,
        payload: {
          divId,
          adsQueueData: [],
          refreshableAdsList,
        },
      });
    }
  };
}
export function addToRefreshableList(DfpAdSlot) {
  return {
    type: ADD_TO_REFRESHABLE_LIST,
    payload: {
      DfpAdSlot,
    },
  };
}
export function refreshAdsFromRefreshableList() {
  return {
    type: REFRESH_ADS_FROM_REFRESHABLE_LIST,
    payload: {},
  };
}

export function refreshDfpAdsFromRefreshableList() {
  return {
    type: REFRESH_DFP_ADS_FROM_REFRESHABLE_LIST,
    payload: {},
  };
}

export function clearDfpAdsFromRefreshableList() {
  return {
    type: CLEAR_DFP_ADS_FROM_REFRESHABLE_LIST,
    payload: {},
  };
}

export function setPrebidData(prebidObj) {
  return {
    type: SET_PREBID_DATA,
    payload: {
      prebidObj,
    },
  };
}

export function updatePrebidFlag(prebid) {
  let prebidOn = false;
  let countryList = [];
  if (prebid && prebid.enabled === 'yes') {
    prebidOn = true;
    if (prebid.geo && prebid.geo.countries && prebid.geo.countries.length > 0) {
      countryList = prebid.geo.countries;
    }
  }
  // for checking in initAdServer function
  if (typeof window !== 'undefined') {
    window.PWT = window.PWT || {};
    window.PWT.prebidOn = prebidOn;
  }

  return {
    type: PREBID_CHECK,
    payload: {
      prebidOn,
      countryList,
    },
  };
}

function recieveAdsCampaign(data) {
  const adsCampaignStatusData =
    data.status === 200 ? _get(data, 'data.parent') : undefined;
  const payload = {
    data: undefined,
  };
  if (typeof adsCampaignStatusData !== 'undefined') {
    payload.data = {};
    Object.keys(adsCampaignConfig).forEach(adName => {
      const adCampaignData = adsCampaignStatusData[adName];
      if (
        Object.prototype.toString.call(adCampaignData) === '[object Object]' &&
        adCampaignData.status === 1
      ) {
        payload.data[adsCampaignConfig[adName]] = {
          geo:
            adCampaignData.loc && adCampaignData.loc === 'All'
              ? ''
              : adCampaignData.loc,
          status: adCampaignData.status,
        };
      }
    });
    if (Object.keys(payload.data || {}).length === 0) {
      payload.data = undefined;
    }
  }
  return {
    type: RECIEVE_ADS_CAMPAIGN,
    payload,
  };
}

function recieveNativeCampaign(data = null) {
  return {
    type: RECIEVE_NATIVE_CAMPAIGN,
    payload: data,
  };
}

function fetchAdsCampaignStatusData(url) {
  return makeRequest.get(url);
}

function fetchNativeCampaign(url) {
  return makeRequest.get(url);
}

const insertOnlyUnique = (myArray, adObject) => {
  const tempArray = myArray.filter(item => item.divId === adObject.divId);
  if (tempArray.length === 0) {
    myArray.push(adObject);
  } else {
    // console.log('duplicat found');
  }
  return myArray;
};

export function loadAdsCampaignStatus(url) {
  const campaignUrl = `${url}${Math.floor(Math.random() * 1000)}`;
  return dispatch => {
    fetchAdsCampaignStatusData(campaignUrl)
      .then(data => dispatch(recieveAdsCampaign(data)))
      .catch(() => {});
  };
}

export function loadNativeCampaign(country) {
  if (country === 'IN') {
    // let ccVal = 'IN';
    // if (window.location.search.indexOf('cc=US') > -1) {
    //   ccVal = 'US';
    // }
    try {
      const resSessionObj = JSON.parse(
        sessionStorage.getItem(RES_NATIVE_CAMPAIGN_STORAGE_KEY),
      );
      if (
        resSessionObj &&
        typeof resSessionObj.lastSessionTimestamp === 'number' &&
        (Date.now() - resSessionObj.lastSessionTimestamp) / (60 * 1000) <
          RES_NATIVE_CAMPAIGN_SESSION_TIME_IN_MIN
      ) {
        return recieveNativeCampaign(resSessionObj.data);
      }
      const campaignUrl = __PROD__
        ? 'https://config.timesofindia.com/tcc-manager/client/native/toim/campaign?cc=IN&fv=760'
        : 'https://nprelease.indiatimes.com/tcc-manager/client/native/toim/campaign?cc=IN&fv=760';
      return dispatch => {
        fetchNativeCampaign(campaignUrl)
          .then(data => {
            if (data && data.status === 200) {
              const sessionStorageVal = {
                data: data.data,
                lastSessionTimestamp: Date.now(),
              };
              sessionStorage.setItem(
                RES_NATIVE_CAMPAIGN_STORAGE_KEY,
                JSON.stringify(sessionStorageVal),
              );
            }
            dispatch(recieveNativeCampaign(data.data));
          })
          .catch(() => {
            dispatch(recieveNativeCampaign());
          });
      };
    } catch (e) {
      debugLogs(e);
    }
  }
  return recieveNativeCampaign();
}

export function setPathForNativeCampaign(path) {
  return {
    type: SET_PATH_NATIVE_CAMPAIGN,
    payload: path,
  };
}

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case ADD_TO_QUEUE: {
      let newAdsQueueData = [];
      if (state.adsQueueData instanceof Array) {
        newAdsQueueData = state.adsQueueData;
      }
      newAdsQueueData = insertOnlyUnique(
        newAdsQueueData,
        action.payload.adObject,
      );
      // console.log(newAdsQueueData);
      // add divid to queue when rendering
      return {
        ...state,
        adsQueueData: [...newAdsQueueData],
      };
    }
    case LOAD_ALL_ADS_FROM_QUEUE: {
      return {
        ...state,
        adsQueueData: action.payload.adsQueueData,
        refreshableAdsList: action.payload.refreshableAdsList,
      };
    }
    case ADD_TO_REFRESHABLE_LIST: {
      return {
        ...state,
        refreshableAdsList:
          state.refreshableAdsList instanceof Array
            ? [...state.refreshableAdsList, action.payload.DfpAdSlot]
            : [action.payload.DfpAdSlot],
      };
    }
    case REFRESH_ADS_FROM_REFRESHABLE_LIST: {
      const adsList = [];
      if (state.refreshableAdsList instanceof Array) {
        state.refreshableAdsList.forEach(adSlot => {
          if (adSlot && adSlot.getSlotElementId) {
            const divId = adSlot.getSlotElementId();
            if (document.getElementById(divId)) {
              adsList.push(adSlot);
            }
          }
        });
      }
      if (adsList.length > 0) {
        // window.googletag.pubads().refresh(adsList, { changeCorrelator: false });
      }
      return {
        ...state,
      };
    }

    case REFRESH_DFP_ADS_FROM_REFRESHABLE_LIST: {
      if (
        state.refreshableAdsList instanceof Array &&
        state.refreshableAdsList.length > 0
      ) {
        window.googletag.cmd.push(() => {
          const _rpmidArry = window.googletag.pubads().getTargeting('_rpmid');
          let _rpmid = '';

          if (_rpmidArry instanceof Array) {
            _rpmid =
              _rpmidArry[0].indexOf('_refresh') === -1
                ? `${_rpmidArry[0]}_refresh`
                : _rpmidArry[0];
          }
          //console.log(_rpmid);
          if (_rpmid) {
            window.googletag.pubads().setTargeting('_rpmid', _rpmid);
          }
          window.googletag.pubads().refresh(state.refreshableAdsList);
        });
      }

      return {
        ...state,
      };
    }

    case CLEAR_DFP_ADS_FROM_REFRESHABLE_LIST: {
      return {
        ...state,
        refreshableAdsList: [],
      };
    }

    case RECIEVE_ADS_CAMPAIGN: {
      return {
        ...state,
        adsCampaignStatus: action.payload.data,
      };
    }
    case RECIEVE_NATIVE_CAMPAIGN: {
      return {
        ...state,
        nativeCampaign: {
          data: action.payload,
        },
      };
    }

    case SET_PATH_NATIVE_CAMPAIGN:
      return {
        ...state,
        pagePath: action.payload,
      };

    case INCREMENT_ADS_COUNTER: {
      return {
        ...state,
        adsCounter:
          parseInt(state.adsCounter, 10) >= 0 ? state.adsCounter + 1 : 1,
      };
    }
    case PREBID_CHECK: {
      return {
        ...state,
        prebidFlag: action.payload.prebidOn,
        prebidCountryList: action.payload.countryList,
      };
    }
    case SET_PREBID_DATA: {
      return {
        ...state,
        prebidObj: action.payload.prebidObj,
      };
    }
    default:
      return state;
  }
}
reducerRegistry.register(reducerName, reducer);
