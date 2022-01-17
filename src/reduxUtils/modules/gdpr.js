/* eslint-disable import/prefer-default-export */
import reducerRegistry from '../../reduxUtils/reducerRegistry';

const reducerName = 'gdpr';
const createActionName = name => `toi/${reducerName}/${name}`;

// actions
export const RECEIVE_DATA = createActionName('RECEIVE_DATA');
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');

function receiveGdprData(data) {
  // console.log('promise success');
  return {
    type: RECEIVE_DATA,
    payload: data,
  };
}

function handleGdprError(error) {
  // console.log('promise failed');
  return {
    type: HANDLE_DATA_ERROR,
    error,
  };
}

export function fetchGdprData() {
  const gdprPromise = new Promise(resolve => {
    if (window.TimesGDPR) {
      window.TimesGDPR.common.consentModule.gdprCallback(data => {
        if (data && typeof data.isEUuser !== 'undefined') {
          resolve({
            ...data,
          });
        } else {
          resolve({ isEUuser: true });
        }
      });
    } else {
      resolve({ isEUuser: true });
    }
  });
  return gdprPromise;
}

export function loadGdprData() {
  return dispatch =>
    fetchGdprData()
      .then(data => dispatch(receiveGdprData(data)))
      .catch(error => dispatch(handleGdprError(error)));
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return {
        ...state,
        isPrivateUser: action.payload.isEUuser,
        data: action.payload,
      };
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
