import reducerRegistry from '../../reduxUtils/reducerRegistry';
import makeRequest from '../../utils/makeRequest';

const reducerName = 'videosearch';
const createActionName = name => `toi/${reducerName}/${name}`;

export const RECEIVE_DATA = createActionName('RECEIVE_DATA');
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');
export const CLEAR_DATA = createActionName('CLEAR_DATA');

function fetchVideosearchData(params) {
  const searchitem = params.searchitem || '';
  const sortorder = params.sortorder || 'score+desc';
  const pageNum = params.pageNum || 1;
  const url = `/video_search_api/showexturl-1,feedtype-sjson,sortOrder-${sortorder},query-${searchitem},page-${pageNum}.cms`;
  //const url = `/video_search_api.cms?showexturl=1&feedtype=sjson&sortOrder=${sortorder}&query=${searchitem}&page=${pageNum}`;
  return makeRequest.get(url);
}

export function receiveVideosearchdata(data) {
  return {
    type: RECEIVE_DATA,
    payload: data.data,
  };
}
export function clearSearchData() {
  return {
    type: CLEAR_DATA,
  };
}
function handleVideosearchDataError() {
  return {
    type: HANDLE_DATA_ERROR,
  };
}

export function loadVideosearchDataCount(params) {
  return dispatch =>
    fetchVideosearchData(params)
      .then(data => dispatch(receiveVideosearchdata(data, params)))
      .catch(error => dispatch(handleVideosearchDataError(error)));
}

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case RECEIVE_DATA: {
      return {
        ...state,
        data: action.payload,
      };
    }
    case CLEAR_DATA: {
      return {
        ...state,
        data: null,
      };
    }
    default:
      return state;
  }
}
reducerRegistry.register(reducerName, reducer);
