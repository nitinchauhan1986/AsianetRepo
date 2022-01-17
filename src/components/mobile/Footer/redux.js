import makeRequest from 'utils/makeRequest';
import reducerRegistry from '../../../reduxUtils/reducerRegistry';

const reducerName = 'footer';
const createActionName = name => `toi/${reducerName}/${name}`;

export const RECEIVE_FOOTER_DATA = createActionName('RECEIVE_FOOTER_DATA');

function callFooterApi() {
  const url = 'http://localhost:3000/dummyfeeds/homefooterdata.json';
  return makeRequest.get(url);
}

function receiveFooterData(data) {
  return {
    type: RECEIVE_FOOTER_DATA,
    payload: {
      ...data,
    },
  };
}

export function loadFooterData() {
  return dispatch =>
    callFooterApi().then(data => dispatch(receiveFooterData(data.data)));
}

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case RECEIVE_FOOTER_DATA: {
      return {
        ...state,
        data: action.payload,
      };
    }

    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
