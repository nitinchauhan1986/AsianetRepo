// import _get from 'lodash.get';
import _get from 'lodash.get';
import produce from 'immer';
import { getFeedUrl } from 'helpers/feeds/generalHelpers';
import reducerRegistry from 'reduxUtils/reducerRegistry';
import { CORONAVIRUS_CARDS_HOME_LITE_JSON_URL } from 'constants/index.js';
import makeRequest from 'utils/makeRequest';
import { getSiteDomain } from 'utils/common';
//import makeRequest from '../../utils/makeRequest';
//import * as cookie from '../../utils/cookies';

const reducerName = 'homepage';
const createActionName = name => `toi/${reducerName}/${name}`;

/* const DESKTOP_HP_API =
  'http://localhost:3000/dummyfeeds/us_hp_desktop_test.json';
const MOBILE_HP_API = 'http://localhost:3000/dummyfeeds/us_hp_mobile_test.json'; */

// const AJAX_SECTION_API = '/dummyfeeds/us_hp_mobile_ajax_test.json';
const HP_CONTENT_FEED_PATH = '/toi/web/page/content?path=/';
const WAP_HP_CONTENT_FEED_PATH =
  '/mobilehomepagefeedspadata.cms?feedtype=sjson';
const WEB_HP_CONTENT_FEED_PATH_TEST =
  '/webhomepagefeedspadatatest.cms?feedtype=sjson';
const WEB_HP_CONTENT_FEED_PATH = '/webhomepagefeedspadata.cms?feedtype=sjson';
const ELECTION_CONTENT_FEED_PATH = '/homepage_election_feed.cms?feedtype=sjson';
// const ELECTION_CONTENT_FEED_PATH = '/homepage_exitpll_feed.cms?feedtype=sjson';

export const RECEIVE_HOME_PAGE_DATA = createActionName(
  'RECEIVE_HOME_PAGE_DATA',
);
export const RECEIVE_PAGINATION_DATA = createActionName(
  'RECEIVE_PAGINATION_DATA',
);
export const RECEIVE_AJAX_SECTION_DATA = createActionName(
  'RECEIVE_AJAX_SECTION_DATA',
);
export const HANDLE_HOME_PAGE_DATA_ERROR = createActionName(
  'HANDLE_DATA_ERROR',
);
export const ADD_NEXT_VIDEO_MSID = createActionName('ADD_NEXT_VIDEO_MSID');

export const SHOW_VIDEO_SECTION_LOADER = createActionName(
  'SHOW_VIDEO_SECTION_LOADER',
);

export const SHOW_TECH_SECTION_LOADER = createActionName(
  'SHOW_TECH_SECTION_LOADER',
);

export const DATA_LOADING = createActionName('DATA_LOADING');

export const DATA_LOADED = createActionName('DATA_LOADED');

export const RECEIVE_ELECTION_DATA = createActionName('RECEIVE_ELECTION_DATA');

export const RECEIVE_CARDS_INSERT_DATA = createActionName(
  'RECEIVE_CARDS_INSERT_DATA',
);
export const HANDLE_ELECTION_DATA_ERROR = createActionName(
  'HANDLE_ELECTION_DATA_ERROR',
);

export const HANDLE_CARDS_INSERTS_DATA_ERROR = createActionName(
  'HANDLE_CARDS_INSERTS_DATA_ERROR',
);

function fetchUSHomePageData(params) {
  /* const url = params.isWapView
    ? MOBILE_HP_API
    : DESKTOP_HP_API; */
  const requestParams = {
    params: {},
  };
  //@todo can't we use object.assign here or use the params directly ?
  //@todo any other use-ase we are catering to ?
  if (params.curpg) {
    requestParams.params.curpg = params.curpg;
  }
  //@todo there could be array of permissible params and those can be read in loop to form the URL parameters ?
  const primeParam = params.isPrime ? '&pc=yes' : '';
  const url = `${getFeedUrl()}${HP_CONTENT_FEED_PATH}${primeParam}`;
  //console.log(`${getFeedUrl()}${HP_CONTENT_FEED_PATH}`)
  return makeRequest.get(url, requestParams);
}

function fetchHomePageData(params) {
  const requestParams = {
    params: {},
  };
  let feedPath = '';
  if (params.testExpando && !params.isWapView) {
    feedPath = WEB_HP_CONTENT_FEED_PATH_TEST;
  } else {
    feedPath = params.isWapView
      ? WAP_HP_CONTENT_FEED_PATH
      : WEB_HP_CONTENT_FEED_PATH;
  }

  // @todo there could be array of permissible params and those can be read in loop to form the URL parameters ?
  const primeParam = params.isPrime ? '&pc1=yes' : '';
  const geoclParam = params.geocl ? `&geocl=${params.geocl}` : '';
  const geolocationParam = params.geolocation
    ? `&geolocation=${params.geolocation}`
    : '';
  const testExpando = params.testExpando ? '&test=expando' : '';
  const url = `${getSiteDomain()}${feedPath}${primeParam}${geoclParam}${geolocationParam}${testExpando}`;
  // console.log('fetchHomePageData url', url);
  return makeRequest.get(url, requestParams, 'skipfeedengine');
}

function fetchElectionData(params) {
  const requestParams = {
    params: {},
  };
  const feedPath = ELECTION_CONTENT_FEED_PATH;
  const pfm = params.isWapView ? 'wap' : 'web';
  const url = `${getSiteDomain()}${feedPath}&pfm=${pfm}`;
  // console.log('fetchHomePageData url', url);
  return makeRequest.get(url, requestParams, 'skipfeedengine');
}

function fetchCardsInsert() {
  return makeRequest.get(
    CORONAVIRUS_CARDS_HOME_LITE_JSON_URL,
    'skipfeedengine',
  );
}

function fetchSectionAjaxData({ clickedItem, sectionId, isPrime }) {
  const { subsectiondID, dataUrl } = clickedItem;
  const primeParam = isPrime ? '&pc=yes' : '';
  const url =
    dataUrl ||
    `${getFeedUrl()}${HP_CONTENT_FEED_PATH}&sectionid=${sectionId}&subsectionid=${subsectiondID}${primeParam}`;
  return makeRequest.get(url);
}

export function dataLoading() {
  return {
    type: DATA_LOADING,
    payload: {},
  };
}

export function dataLoaded() {
  return {
    type: DATA_LOADED,
    payload: {},
  };
}

export function addNextVideoMsid(msidForNextVideo, slikeId) {
  return {
    type: ADD_NEXT_VIDEO_MSID,
    payload: { msidForNextVideo, slikeId },
  };
}

function handleHomePageDataError() {
  return {
    type: HANDLE_HOME_PAGE_DATA_ERROR,
    payload: {},
  };
}

export function reciveHomePageData(data) {
  return {
    type: RECEIVE_HOME_PAGE_DATA,
    payload: data,
  };
}

function receiveElectionData(data) {
  return {
    type: RECEIVE_ELECTION_DATA,
    payload: data,
  };
}
function receiveCardsInsertData(data) {
  return {
    type: RECEIVE_CARDS_INSERT_DATA,
    payload: data,
  };
}

function handleElectionDataError() {
  return {
    type: HANDLE_ELECTION_DATA_ERROR,
    payload: {},
  };
}

function handleCardsInsertDataError() {
  return {
    type: HANDLE_CARDS_INSERTS_DATA_ERROR,
    payload: {},
  };
}

function receivePaginationData(data) {
  return {
    type: RECEIVE_PAGINATION_DATA,
    payload: data,
  };
}

function receiveSectionAjaxData(data, params) {
  return {
    type: RECEIVE_AJAX_SECTION_DATA,
    payload: {
      ajaxData: data,
      params,
    },
  };
}

function toggleVideosSectionLoader(showLoader) {
  return {
    type: SHOW_VIDEO_SECTION_LOADER,
    payload: {
      showLoader,
    },
  };
}

function toggleTechSectionLoader(showLoader) {
  return {
    type: SHOW_TECH_SECTION_LOADER,
    payload: {
      showLoader,
    },
  };
}

// export function loadIndiaHPData(data) {
//   return dispatch => {
//     dispatch(reciveHomePageData(data));
//   };
// }

export function loadElectionData(params) {
  return dispatch =>
    // dispatch(dataLoading());
    fetchElectionData(params)
      .then(response => {
        // dispatch(dataLoaded());
        dispatch(receiveElectionData(response.data, params));
      })
      .catch(error => {
        //dispatch(dataLoaded());
        dispatch(handleElectionDataError(error));
      });
}

export function loadIndiaHPData(params, staticFeed) {
  if (staticFeed) {
    return dispatch => {
      dispatch(reciveHomePageData(params));
    };
  }
  return dispatch =>
    // dispatch(dataLoading());
    fetchHomePageData(params)
      .then(response => {
        // dispatch(dataLoaded());
        dispatch(reciveHomePageData(response.data, params));
      })
      .catch(error => {
        //dispatch(dataLoaded());
        dispatch(handleHomePageDataError(error));
      });
}

export function loadHomePageData(params) {
  return dispatch => {
    dispatch(dataLoading());
    return fetchUSHomePageData(params)
      .then(response => {
        dispatch(dataLoaded());
        if (params.curpg) {
          dispatch(receivePaginationData(response.data, params));
        } else {
          dispatch(reciveHomePageData(response.data, params));
        }
      })
      .catch(error => {
        dispatch(dataLoaded());
        dispatch(handleHomePageDataError(error));
      });
  };
}

export function loadAjaxSectionData(params) {
  let sectionId = '';
  if (typeof params.sectionId === 'string') {
    sectionId = params.sectionId.toLowerCase();
  }
  return dispatch => {
    if (sectionId === 'videos') {
      dispatch(toggleVideosSectionLoader(true));
    } else if (sectionId === 'tech') {
      dispatch(toggleTechSectionLoader(true));
    }
    return fetchSectionAjaxData(params)
      .then(response => {
        dispatch(receiveSectionAjaxData(response.data, params));
        if (sectionId === 'videos') {
          dispatch(toggleVideosSectionLoader(false));
        } else if (sectionId === 'tech') {
          dispatch(toggleTechSectionLoader(false));
        }
      })
      .catch(error => {
        dispatch(handleHomePageDataError(error));
        if (sectionId === 'videos') {
          dispatch(toggleVideosSectionLoader(false));
        } else if (sectionId === 'tech') {
          dispatch(toggleTechSectionLoader(false));
        }
      });
  };
}

export function loadCardsInsert() {
  return dispatch =>
    fetchCardsInsert()
      .then(response => {
        dispatch(receiveCardsInsertData(response.data));
      })
      .catch(error => {
        dispatch(handleCardsInsertDataError(error));
      });
}

export default function reducer(state = {}, action = {}) {
  // console.log(action);
  switch (action.type) {
    case DATA_LOADING: {
      return {
        ...state,
        dataLoading: true,
      };
    }
    case DATA_LOADED: {
      return {
        ...state,
        dataLoading: false,
      };
    }
    case RECEIVE_HOME_PAGE_DATA: {
      return {
        ...state,
        data: action.payload,
      };
    }
    case RECEIVE_ELECTION_DATA: {
      return {
        ...state,
        electionData: action.payload,
      };
    }
    case RECEIVE_CARDS_INSERT_DATA: {
      return {
        ...state,
        cardsInserts: action.payload,
      };
    }
    case HANDLE_ELECTION_DATA_ERROR: {
      return {
        ...state,
        electionData: {},
      };
    }
    case HANDLE_CARDS_INSERTS_DATA_ERROR: {
      return {
        ...state,
        cardsInserts: {},
      };
    }

    case RECEIVE_PAGINATION_DATA: {
      const { data = {}, pagination } = action.payload;
      const newState = produce(state, draftState => {
        const pageData = _get(draftState, 'data');
        pageData.data = [...pageData.data, ...data];
        pageData.pagination.currenPage = pagination.currenPage;
      });
      return newState;
    }
    case RECEIVE_AJAX_SECTION_DATA: {
      const { ajaxData = {} } = action.payload;
      const { params = {} } = action.payload;
      let indexOfFetchedSectionInSectionArray;
      const nextState = produce(state, draftState => {
        const pageData = _get(draftState, 'data');

        if (_get(pageData, 'sections') instanceof Array) {
          pageData.sections.forEach((item, index) => {
            if (params.sectionId === item.id) {
              indexOfFetchedSectionInSectionArray = index;
            }
          });

          if (typeof indexOfFetchedSectionInSectionArray === 'number') {
            pageData.sections[indexOfFetchedSectionInSectionArray].items =
              ajaxData.items;
          }
        } else {
          // console.log('section not found');
        }
      });

      return nextState;
    }
    case ADD_NEXT_VIDEO_MSID: {
      return {
        ...state,
        msidForNextVideo: action.payload.msidForNextVideo,
        slikeId: action.payload.slikeId,
      };
    }
    case HANDLE_HOME_PAGE_DATA_ERROR: {
      return {
        ...state,
      };
    }

    case SHOW_VIDEO_SECTION_LOADER: {
      return {
        ...state,
        showVideoSectionLoader: action.payload.showLoader,
      };
    }

    case SHOW_TECH_SECTION_LOADER: {
      return {
        ...state,
        showTechSectionLoader: action.payload.showLoader,
      };
    }

    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
