/* eslint-disable import/prefer-default-export */
import reducerRegistry from '../../reduxUtils/reducerRegistry';
import makeRequest from '../../utils/makeRequest';

const reducerName = 'footer';
const createActionName = name => `toi/${reducerName}/${name}`;

// actions
export const RECEIVE_DATA = createActionName('RECEIVE_DATA');
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');

function receiveFooterData(data) {
  return {
    type: RECEIVE_DATA,
    payload: data,
  };
}

function handleFooterError(error) {
  return {
    type: HANDLE_DATA_ERROR,
    error,
  };
}

function fetchFooterData(params) {
  const wapParameter = params.isWapView ? ',frmwap-yes' : '';
  const appParameter = params.isAppView ? ',frmapp-yes' : '';
  const msidParameter =
    !params.isWapView && !params.isAppView && params.msid
      ? `,msid-${params.msid}`
      : '';
  const url = `/feeds/feed_footer/feedtype-json${wapParameter}${appParameter}${msidParameter}.cms?path=${encodeURIComponent(
    params.fullPath,
  )}`;
  return makeRequest.get(url);
}

export function loadFooterData(params) {
  return dispatch =>
    fetchFooterData(params)
      .then(data => dispatch(receiveFooterData(data.data)))
      .catch(error => dispatch(handleFooterError(error)));
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
