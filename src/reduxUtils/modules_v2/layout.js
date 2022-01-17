import makeRequest from 'utils/makeRequest';
import { getFeedUrl } from 'helpers/feeds/generalHelpers';
import { receiveNavigationData } from './header';
import { receiveFooterData } from './footer';
import { receiveCommonData } from './common';
import { receiveSidebarData } from './sidebar';

//const HP_LAYOUT_API_PATH = '/toi/web/page/layout?vesrion=v2&path=/';
const DEFAULT_LAYOUT_API_PATH = '/toi/web/show/news?layout=1&version=v2&path=';
const DEFAULT_COMMON_API_PATH = '/toi/web/page/common?version=v2&path=';
const DEFAULT_SIDEBAR_API_PATH = '/toi/web/page/sidebar?version=v2&path=';
const DEFAULT_LAYOUT_API_PATH_LB = '/toi/web/show/lb?layout=1&version=v2&path=';
const DEFAULT_LAYOUT_API_PATH_LIST =
  '/toi/web/list/news?layout=1&version=v2&path=';
// const DEFAULT_LAYOUT_API_PATH_COVID =
//   '/toi/web/list/news?layout=1&version=v2&path=';

function getActiveSectionPath(path) {
  let activeSectionPath = '/';
  if (path.indexOf('.cms') !== -1) {
    // #todo to be done using regex
    const pathParts = path.split('/');
    const pathSections = pathParts.slice(0, pathParts.length - 3);

    if (pathSections && pathSections.length >= 2) {
      activeSectionPath = pathSections.join('/');
    }
  } else {
    // short URL / listing pages
    activeSectionPath = path || activeSectionPath;
  }
  return activeSectionPath;
}

function callLayoutApi(params) {
  const primeParam = params.isPrime ? '&pc=yes' : '';
  const isClientConsumable = params.isClientConsumable
    ? '&test=consumable'
    : '';
  const feedUrl = `${getFeedUrl()}${DEFAULT_LAYOUT_API_PATH}${
    params.fullPath
  }${primeParam}${isClientConsumable}`;
  // console.log('feedUrl', feedUrl);
  return makeRequest.get(feedUrl);
}

function callLayoutApiLB(params) {
  const primeParam = params.isPrime ? '&pc=yes' : '';
  const feedUrl = `${getFeedUrl()}${DEFAULT_LAYOUT_API_PATH_LB}${
    params.shortPath
  }${primeParam}`;
  // console.log(feedUrl);
  return makeRequest.get(feedUrl);
}

function callLayoutApiList(params) {
  const primeParam = params.isPrime ? '&pc=yes' : '';
  const feedUrl = `${getFeedUrl()}${DEFAULT_LAYOUT_API_PATH_LIST}${
    params.fullPath
  }${primeParam}`;
  // console.log(feedUrl);
  // console.log(feedUrl);
  return makeRequest.get(feedUrl);
}

// function callLayoutApiCovid(params) {
//   const primeParam = params.isPrime ? '&pc=yes' : '';
//   const feedUrl = `${getFeedUrl()}${DEFAULT_LAYOUT_API_PATH_COVID}${
//     params.fullPath
//   }${primeParam}`;
//   // console.log(feedUrl);
//   return makeRequest.get(feedUrl);
// }

function callCommonApi(params, resolvedRoute = '/') {
  const primeParam = params.isPrime ? '&pc=yes' : '';
  const activeSectionPath = getActiveSectionPath(params.fullPath);
  const feedUrl = `${getFeedUrl()}${DEFAULT_COMMON_API_PATH}${activeSectionPath}&template=${resolvedRoute}${primeParam}`;
  return makeRequest.get(feedUrl);
}

function callSidebarApi(params) {
  const primeParam = params.isPrime ? '&pc=yes' : '';
  let xtraParam = '';
  if (
    params.fullPath.includes('/liveblog/') &&
    params.fullPath.includes('/sports/')
  ) {
    xtraParam = '&template=sportsLb';
  } else if (
    params.fullPath.includes('/liveblog/') &&
    params.fullPath.includes('/entertainment/')
  ) {
    xtraParam = '&template=etimesmovies';
  } else if (
    params.fullPath.includes('/liveblog/') &&
    params.fullPath.includes('/tv/')
  ) {
    xtraParam = '&template=etimestv';
  } else if (
    params.fullPath.includes('/liveblog/') &&
    params.fullPath.includes('/life-style/')
  ) {
    xtraParam = '&template=etimeslifestyle';
  }

  const feedUrl = `${getFeedUrl()}${DEFAULT_SIDEBAR_API_PATH}${
    params.fullPath
  }${primeParam}${xtraParam}`;
  return makeRequest.get(feedUrl);
}

function callSidebarApiMobile(params) {
  const primeParam = params.isPrime ? '&pc=yes' : '';
  let xtraParam = '';
  if (
    params.fullPath.includes('/liveblog/') &&
    params.fullPath.includes('/sports/')
  ) {
    xtraParam = '&template=sportsLb';
  } else if (
    params.fullPath.includes('/liveblog/') &&
    params.fullPath.includes('/entertainment/')
  ) {
    xtraParam = '&template=etimesmovies';
  } else if (
    params.fullPath.includes('/liveblog/') &&
    params.fullPath.includes('/tv/')
  ) {
    xtraParam = '&template=etimestv';
  } else if (
    params.fullPath.includes('/liveblog/') &&
    params.fullPath.includes('/life-style/')
  ) {
    xtraParam = '&template=etimeslifestyle';
  }
  const feedUrl = `${getFeedUrl()}${DEFAULT_SIDEBAR_API_PATH}${
    params.fullPath
  }${primeParam}${xtraParam}`;
  return makeRequest.getwap(feedUrl);
}

export function loadSidebarData(params) {
  return dispatch =>
    callSidebarApi(params).then(response => {
      const { data = {} } = response;
      dispatch(receiveSidebarData(data));
    });
}

export function loadSidebarDataMobile(params) {
  return dispatch =>
    callSidebarApiMobile(params).then(response => {
      const { data = {} } = response;
      dispatch(receiveSidebarData(data));
    });
}

export function loadCommonData(params, resolvedRoute) {
  return dispatch =>
    callCommonApi(params, resolvedRoute).then(response => {
      const { data = {} } = response;
      dispatch(receiveCommonData(data));
    });
}

// eslint-disable-next-line import/prefer-default-export
export function loadLayoutData(params) {
  return dispatch =>
    callLayoutApi(params).then(response => {
      const { data = {} } = response;
      dispatch(receiveNavigationData(data.header));
      dispatch(receiveFooterData(data.footer));
      dispatch(receiveCommonData(data.common));
      if (data.sidebar) {
        dispatch(receiveSidebarData(data.sidebar));
      }
    });
}
export function loadLayoutDataList(params) {
  return dispatch =>
    callLayoutApiList(params).then(response => {
      const { data = {} } = response;
      dispatch(receiveNavigationData(data.header));
      dispatch(receiveFooterData(data.footer));
      dispatch(receiveCommonData(data.common));
      if (data.sidebar) {
        dispatch(receiveSidebarData(data.sidebar));
      }
    });
}

export function loadLayoutDataLB(params) {
  return dispatch =>
    callLayoutApiLB(params).then(response => {
      const { data = {} } = response;
      dispatch(receiveNavigationData(data.header));
      dispatch(receiveFooterData(data.footer));
      dispatch(receiveCommonData(data.common));
      // if (data.sidebar) {
      //   dispatch(receiveSidebarData(data.sidebar));
      // }
    });
}

export function loadLayoutDataUSHP(params) {
  return dispatch =>
    callLayoutApiList(params).then(response => {
      const { data = {} } = response;
      dispatch(receiveNavigationData(data.header));
      dispatch(receiveFooterData(data.footer));
      dispatch(receiveCommonData(data.common));
      if (data.sidebar) {
        dispatch(receiveSidebarData(data.sidebar));
      }
    });
}
