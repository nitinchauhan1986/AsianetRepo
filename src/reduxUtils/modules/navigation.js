/* eslint-disable import/prefer-default-export */
import reducerRegistry from '../../reduxUtils/reducerRegistry';
import makeRequest from '../../utils/makeRequest';

const reducerName = 'navigation';
const createActionName = name => `toi/${reducerName}/${name}`;
const initialUserState = {
  navStories: {},
};
// actions
export const RECEIVE_DATA = createActionName('RECEIVE_DATA');
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');
export const RECEIVE_STORIES = createActionName('RECEIVE_STORIES');
export const SET_ACTIVE_SUB_SECTION = createActionName(
  'SET_ACTIVE_SUB_SECTION',
);
export const UPDATE_ACTIVE_SECTION = createActionName('UPDATE_ACTIVE_SECTION');
export const UPDATE_OPENAPP_URL = createActionName('UPDATE_OPENAPP_URL');
export const GET_ACTIVE_CFMID = createActionName('GET_ACTIVE_CFMID');
export const SET_FIXED_HEADER_STATUS = createActionName(
  'SET_FIXED_HEADER_STATUS',
);

export function setFixedHeaderStatus(status) {
  return {
    type: SET_FIXED_HEADER_STATUS,
    payload: status,
  };
}

function receiveNavigationData(data) {
  return {
    type: RECEIVE_DATA,
    payload: data,
  };
}

export function updateActiveSubSection(path) {
  return {
    type: SET_ACTIVE_SUB_SECTION,
    payload: path,
  };
}

export function updateActiveSection(sectionName) {
  return {
    type: UPDATE_ACTIVE_SECTION,
    payload: sectionName,
  };
}

export function getActiveCfmid(data) {
  return {
    type: GET_ACTIVE_CFMID,
    payload: data,
  };
}

function getUpdatedNavigationData(navigationData, path) {
  if (!navigationData || !path.length) {
    return navigationData;
  }

  // deep cloning to keep orginalOrder in actual state intact
  const data = JSON.parse(JSON.stringify(navigationData));

  // e.g. /sports/cricket/india-vs-australia/schedule
  // sports - path[1]
  const urlMainSection = path[1];
  // cricket - path[2]
  const urlSubsection1 = path[2];
  // india-vs-australia - path[3]
  const urlSubsection2 = path[3];
  // schedule - path[4]
  // not needed for videos section
  // const urlSubsection3 = path[4];

  // clear existing active items

  // clear active on main nav except root
  // eslint-disable-next-line array-callback-return
  Object.keys(data.sections).map(key => {
    if (typeof data.sections[key] === 'object') {
      if (data.sections[key].style !== 'root') {
        data.sections[key].active = '';
      }
    }
  });

  let mainNavActiveIndex;

  // handle main nav
  if (urlSubsection1) {
    const mainNavOriginalOrder = JSON.parse(JSON.stringify(data.originalOrder));
    mainNavActiveIndex = mainNavOriginalOrder.indexOf(urlSubsection1);
    const mainNavRootIndex = mainNavOriginalOrder.indexOf(urlMainSection);
    if (mainNavActiveIndex > -1) {
      //change order only if active subsection is in cyclic more menu
      // if (data.sections[urlSubsection1].cyclic) {
      mainNavOriginalOrder.splice(mainNavActiveIndex, 1);
      mainNavOriginalOrder.splice(mainNavRootIndex + 1, 0, urlSubsection1);
      data.order = mainNavOriginalOrder;
      // }
      // eslint-disable-next-line array-callback-return
      Object.keys(data.sections).map(key => {
        if (typeof data.sections[key] === 'object') {
          if (key === urlSubsection1) {
            data.sections[key].active = 'yes';
          } else if (data.sections[key].style !== 'root') {
            data.sections[key].active = '';
          }
        }
      });
    }
  }

  // handle sub nav (main nav's first active item's children)
  // videos section has the root's children in subnav and ref children in main nav
  // hence, if url has sub sec 1 but it is not found in main nav, check in sub nav
  // or if url has sub sec 2 check in sub nav

  const subNavParentKeys = data.order.filter(
    sectionKey =>
      data.sections[sectionKey] && data.sections[sectionKey].active === 'yes',
  );
  let subNavParent;

  // sub-nav data
  // picks first active item from the main nav to expand
  if (subNavParentKeys.length) {
    subNavParent = data.sections[subNavParentKeys[0]];
    // clear active on sub nav except root
    // eslint-disable-next-line array-callback-return
    Object.keys(subNavParent.sections).map(key => {
      if (typeof subNavParent.sections[key] === 'object') {
        if (subNavParent.sections[key].style !== 'root') {
          subNavParent.sections[key].active = '';
        }
      }
    });
  }
  // if active subsec 1 not found in main nav, check for that , else check url subsec 2
  if ((urlSubsection1 && mainNavActiveIndex < 0) || urlSubsection2) {
    const urlSubsectionToCheck =
      urlSubsection1 && mainNavActiveIndex < 0
        ? urlSubsection1
        : urlSubsection2;

    const subNavOriginalOrder = JSON.parse(
      JSON.stringify(subNavParent.originalOrder),
    );

    const subNavActiveIndex = subNavOriginalOrder.indexOf(urlSubsectionToCheck);

    if (subNavActiveIndex > -1) {
      //change order only if active subsection is in cyclic more menu
      // if (subNavParent.sections[urlSubsectionToCheck].cyclic) {
      // const subNavRootIndex = subNavOriginalOrder.indexOf(urlSubsectionToCheck);
      subNavOriginalOrder.splice(subNavActiveIndex, 1);
      // #todo check when back button and root active it should be 2, 0,
      subNavOriginalOrder.splice(1, 0, urlSubsectionToCheck);
      subNavParent.order = subNavOriginalOrder;
      // }
      // eslint-disable-next-line array-callback-return
      Object.keys(subNavParent.sections).map(key => {
        if (typeof subNavParent.sections[key] === 'object') {
          if (key === urlSubsectionToCheck) {
            subNavParent.sections[key].active = 'yes';
          } else if (subNavParent.sections[key].style !== 'root') {
            subNavParent.sections[key].active = '';
          }
        }
      });
    }
  }

  // handle sub nav with subnav's active child's chidren

  ///// not required for videos section
  data.path = path.join('/');

  return data;
}

function receiveNavigationStories(id, data) {
  //if (preload && param) localStorage.setItem(param, JSON.stringify(data));
  return {
    type: RECEIVE_STORIES,
    payload: data,
    key: id,
  };
}

function handleNavigationError(error) {
  return {
    type: HANDLE_DATA_ERROR,
    error,
  };
}

export function updateOpenAppUrl(data) {
  return {
    type: UPDATE_OPENAPP_URL,
    payload: data,
  };
}

function fetchNavigationStories(param, params) {
  let url = `/_feed/navjson/nav-${param}.cms`;
  if (params) url += params;
  return makeRequest.get(url);
}
function fetchExternalNavigationStories(url) {
  return makeRequest.get(url);
}
export function preloadNavigationStories(data) {
  return dispatch =>
    Object.entries(data.sections).map(
      item =>
        item[1].head &&
        fetchNavigationStories(item[1].msid, '?preload=1')
          .then(response =>
            dispatch(receiveNavigationStories(item[1].msid, response.data)),
          )
          .catch(error => dispatch(handleNavigationError(error))),
    );
}

export function loadNavigationStories(id, datasource) {
  return dispatch => {
    if (datasource) {
      fetchExternalNavigationStories(datasource)
        .then(data => dispatch(receiveNavigationStories(id, data.data, 1)))
        .catch(error => dispatch(handleNavigationError(error)));
    } else {
      fetchNavigationStories(id)
        .then(data => dispatch(receiveNavigationStories(id, data.data, 1)))
        .catch(error => dispatch(handleNavigationError(error)));
    }
  };
}

function fetchNavigationData(params) {
  const appParameter = params.isAppView ? ',frmapp-yes' : '';
  const wapParameter = params.isWapView ? ',frmwap-yes' : '';
  // const sameSectionParameter = params.sameSectionRouting
  // ? '&samesection=yes'
  // : '';
  const sameSectionParameter = ''; // to be taken up later
  let msidParameter = '';
  if (params.msid) {
    msidParameter = `,msid-${params.msid}`;
  }
  const experimentParameter = params.expid ? `,expid-${params.expid}` : '';
  const url = `/_feed/feed_navigation_legacy_v3/feedtype-json${appParameter}${wapParameter}${sameSectionParameter}${msidParameter}${experimentParameter}.cms?path=${encodeURIComponent(
    // const url = `/feeds/feed_header.cms?path=${encodeURIComponent(
    params.path,
  )}`;
  return makeRequest.get(url);
}

function updateActiveSubSectionUsingCfmid(actualData, activeCfmid) {
  if (!actualData) {
    return {};
  }
  const tempData = JSON.parse(JSON.stringify(actualData));
  const data = tempData.sections;
  if (data) {
    let activeSection = {};
    Object.keys(data).forEach(key => {
      if (data[key].active && data[key].active === 'yes') {
        activeSection = data[key];
      }
    });
    if (activeSection) {
      const subSections = activeSection.sections;
      let activeSubSectionKey = '';
      if (subSections) {
        Object.keys(subSections).forEach(key => {
          const subSection = subSections[key];
          if (subSection.cfmid && subSection.cfmid === activeCfmid) {
            subSection.active = 'yes';
            activeSubSectionKey = key;
          }
        });

        let { order } = activeSection;
        if (activeSubSectionKey) {
          const tempArr = order.filter(e => e !== activeSubSectionKey);
          order = [activeSubSectionKey, ...tempArr];
        }
        activeSection.sections = subSections;
        activeSection.order = order;

        Object.keys(data).forEach(key => {
          if (data[key].active && data[key].active === 'yes') {
            data[key] = activeSection;
          }
        });
      }
    }
  }
  tempData.sections = data;
  return tempData;
}

export function loadNavigationData(params) {
  // ********* Loading Preload Data ********
  // const { isWapView } = params;
  return dispatch =>
    fetchNavigationData(params)
      .then(data => {
        // console.log(data.data);
        dispatch(receiveNavigationData(data.data));
      })
      .catch(error => {
        // console.log(error);
        dispatch(handleNavigationError(error));
      });
}

export default function reducer(state = initialUserState, action) {
  const stories = state.navStories || {};
  let { payload } = action;

  switch (action.type) {
    case RECEIVE_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
        timestamp: Date.now(),
      };
    case SET_ACTIVE_SUB_SECTION: {
      const data = getUpdatedNavigationData(state.data, payload);
      return {
        ...state,
        timestamp: Date.now(),
        data: data || state.data,
      };
    }
    case RECEIVE_STORIES:
      if (typeof payload === 'string') {
        // to remove linebreaks tabs etc
        payload = payload.replace(/\s\s+/g, ' ');

        // to remove xslt error comments, using while loop because regex replaces all content between first comment's start and last comment's end
        while (payload.indexOf('<!--') > -1) {
          payload =
            payload.substr(0, payload.indexOf('<!--')) +
            payload.substr(payload.indexOf('-->') + 3, payload.length);
        }

        //convert to json
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          payload = {};
        }
      }

      if (payload.items instanceof Array) {
        payload.items.forEach(item => {
          stories[item.catkey] = item;
        });
      } else {
        stories[action.key] = payload;
      }
      return {
        ...state,
        navStories: stories,
      };

    case UPDATE_OPENAPP_URL:
      return {
        ...state,
        openappUrl: payload,
      };

    case GET_ACTIVE_CFMID: {
      const data = updateActiveSubSectionUsingCfmid(state.data, payload);
      return {
        ...state,
        timestamp: Date.now(),
        data: data || state.data,
      };
    }
    case SET_FIXED_HEADER_STATUS: {
      return {
        ...state,
        fixedHeaderStatus: payload,
      };
    }

    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
