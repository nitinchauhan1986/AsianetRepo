/* eslint-disable linebreak-style */
import {
  TOI_SUBS_COMMON_NUDGES_TRANSLATIONS_MWEB,
  TOI_SUBS_COMMON_NUDGES_TRANSLATIONS_WEB,
} from 'constants/index';
import reducerRegistry from '../reducerRegistry';
import makeRequest from '../../utils/makeRequest';

const reducerName = 'translationConfig';
const createActionName = name => `toi/${reducerName}/${name}`;
export const RECEIVE_TRANSLATION_DATA = createActionName(
  'RECEIVE_TRANSLATION_DATA',
);
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');

function handleError(error) {
  //console.log('handle error');
  return {
    type: HANDLE_DATA_ERROR,
    error,
  };
}

export function getTranslationData(isWapView, countryCode) {
  let url = isWapView
    ? TOI_SUBS_COMMON_NUDGES_TRANSLATIONS_MWEB
    : TOI_SUBS_COMMON_NUDGES_TRANSLATIONS_WEB;
  url += `&cc=${countryCode}`;
  return makeRequest.get(url, {}, 'skipfeedengine');
}
function receiveTranslationData(data) {
  return {
    type: RECEIVE_TRANSLATION_DATA,
    payload: {
      data,
    },
  };
}
export function loadTranslationData(isWapView, currencyCode) {
  return dispatch => {
    getTranslationData(isWapView, currencyCode)
      .then(response => {
        if (response && response.data) {
          dispatch(receiveTranslationData(response.data));
        }
      })
      .catch(error => dispatch(handleError(error)));
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TRANSLATION_DATA: {
      const { data } = action.payload;
      return {
        ...state,
        data,
      };
    }
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
