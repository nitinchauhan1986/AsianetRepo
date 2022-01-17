/* eslint-disable import/prefer-default-export */
import reducerRegistry from '../../reduxUtils/reducerRegistry';
import makeRequest from '../../utils/makeRequest';

const reducerName = 'rhs';
const createActionName = name => `toi/${reducerName}/${name}`;

// actions
export const RECEIVE_DATA = createActionName('RECEIVE_DATA');
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');

function receiverRhsData(data) {
  return {
    type: RECEIVE_DATA,
    payload: data,
  };
}

function handleRhsError(error) {
  return {
    type: HANDLE_DATA_ERROR,
    error,
  };
}

function fetchRhsData(params) {
  //@TODO: Refactor this
  const template = params.fullPath.includes('articleshow')
    ? 'feed_sidebar_as'
    : 'feed_sidebar';
  const primeParam = params.isPrimeUser ? 'pc1=yes&' : '';
  const experimentParameter = params.expid ? `,expid-${params.expid}` : '';
  const url = `/${template}/msid-${
    params.msid
  },feedtype-sjson${experimentParameter}.cms?${primeParam}path=${encodeURIComponent(
    params.path,
  )}`;
  return makeRequest.get(url, {}, 'skipfeedengine');
}

export function loadRhsData(params) {
  return dispatch =>
    fetchRhsData(params)
      .then(data => dispatch(receiverRhsData(data)))
      .catch(error => dispatch(handleRhsError(error)));
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return {
        ...state,
        rhsData: action.payload.data,
      };
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
