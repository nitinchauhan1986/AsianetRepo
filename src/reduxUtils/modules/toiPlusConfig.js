/* eslint-disable linebreak-style */
import {
  TOI_PLUS_ENABLING_CONDITIONS_API_WEB,
  TOI_PLUS_ENABLING_CONDITIONS_API_MWEB,
} from 'constants/index';
import { isPrimeUser } from 'utils/common';
import reducerRegistry from '../reducerRegistry';
import makeRequest from '../../utils/makeRequest';

const reducerName = 'toiplusconfig';
const createActionName = name => `toi/${reducerName}/${name}`;

export const RECEIVE_TOI_PLUS_CONFIG = createActionName(
  'RECEIVE_TOI_PLUS_CONFIG',
);
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');

function handleError(error) {
  //console.log('handle error');
  return {
    type: HANDLE_DATA_ERROR,
    error,
  };
}

function receiveToiPlusConfigData(
  data,
  isPrime,
  currentContinent,
  currentRegion,
  currentCountry,
) {
  return {
    type: RECEIVE_TOI_PLUS_CONFIG,
    payload: {
      data,
      isPrime,
      currentContinent,
      currentRegion,
      currentCountry,
    },
  };
}

export function getToiPlusConfig(isWapView) {
  const url = isWapView
    ? TOI_PLUS_ENABLING_CONDITIONS_API_MWEB
    : TOI_PLUS_ENABLING_CONDITIONS_API_WEB;
  return makeRequest.get(url, {}, 'skipfeedengine');
}

export function loadToiPlusConfig(
  isPrime,
  isWapView,
  currentContinent,
  currentRegion,
  currentCountry,
) {
  return dispatch => {
    getToiPlusConfig(isWapView)
      .then(data => {
        if (data && data.data) {
          dispatch(
            receiveToiPlusConfigData(
              data.data,
              isPrime,
              currentContinent,
              currentRegion,
              currentCountry,
            ),
          );
        }
      })
      .catch(error => dispatch(handleError(error)));
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TOI_PLUS_CONFIG: {
      const {
        data,
        isPrime,
        currentContinent,
        currentRegion,
        currentCountry,
      } = action.payload;
      // const isToiPlusEnabledInRegion =
      //   data.toiPlusEnabledCountries.indexOf(currentCountry) > -1;
      const isToiPlusEnabledInRegion = !(
        data.toiPlusDisabledCountries.indexOf(currentCountry) > -1
      );
      let showToiPlusEntryPoints = false;
      let showToiPlusNudges = false;
      let showToiPlusCongratspopup = true;
      let showToiPlusPlanPage = true;
      const isToiPlusUser = isPrime || isPrimeUser();
      const { legalDisabledCountries = {} } = data;
      const isLegalDisabledRegion =
        legalDisabledCountries &&
        legalDisabledCountries.region.indexOf(currentRegion) > -1;
      const isLegalDisabledContinent =
        legalDisabledCountries &&
        legalDisabledCountries.continent.indexOf(currentContinent) > -1;
      if (isLegalDisabledRegion || isLegalDisabledContinent) {
        showToiPlusCongratspopup = false;
        showToiPlusPlanPage = false;
      }

      if (isToiPlusEnabledInRegion) {
        if (!isLegalDisabledRegion && !isLegalDisabledContinent) {
          showToiPlusEntryPoints = true;
          if (!isToiPlusUser) {
            showToiPlusNudges = true;
          }
        }
      } else if (
        isToiPlusUser &&
        !isLegalDisabledRegion &&
        !isLegalDisabledContinent
      ) {
        showToiPlusEntryPoints = true;
      }

      return {
        ...state,
        showToiPlusEntryPoints,
        showToiPlusPlanPage,
        showToiPlusCongratspopup,
        showToiPlusNudges,
      };
    }
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
