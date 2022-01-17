/* eslint-disable import/prefer-default-export */
import { getFeedUrl } from 'helpers/feeds/generalHelpers';
import reducerRegistry from '../../reduxUtils/reducerRegistry';
import makeRequest from '../../utils/makeRequest';
import Cookie from '../../utils/cookies';

const reducerName = 'geo';
const createActionName = name => `toi/${reducerName}/${name}`;

// actions
export const LOAD_GEO_DATA = createActionName('LOAD_GEO_DATA');
export const RECEIVE_DATA = createActionName('RECEIVE_DATA');
export const RECEIVE_CITY_DATA = createActionName('RECEIVE_CITY_DATA');
export const RECEIVE_DEFAULT_GEO_DATA = createActionName(
  'RECEIVE_DEFAULT_GEO_DATA',
);
export const RECEIVE_FALLBACK_GEO_DATA = createActionName(
  'RECEIVE_FALLBACK_GEO_DATA',
);

export const RECEIVE_STATE_DATA = createActionName('RECEIVE_STATE_DATA');
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');
const DEFAULT_STATE = 'Delhi';

export function loadGeoData(geoObj) {
  let currentCity = 'Noida';
  let currentCountry;
  let currentContinent;
  let currentRegion;
  if (typeof window !== 'undefined') {
    currentCity = Cookie.get('geolocation');
  }

  if (Object.prototype.toString.call(geoObj) === '[object Object]') {
    currentCountry =
      typeof geoObj.CountryCode === 'string' ? geoObj.CountryCode : '';
    currentContinent =
      typeof geoObj.Continent === 'string' ? geoObj.Continent : '';
    currentRegion =
      typeof geoObj.region_code === 'string' ? geoObj.region_code : '';
  }

  return {
    type: LOAD_GEO_DATA,
    payload: {
      currentCountry,
      currentContinent,
      currentCity,
      currentRegion,
    },
  };
}

function receiveCityData(data) {
  return {
    type: RECEIVE_CITY_DATA,
    payload: {
      data,
    },
  };
}

function receiveStateData(data) {
  return {
    type: RECEIVE_STATE_DATA,
    payload: {
      data,
    },
  };
}

function receiveFallBackGeoData(data) {
  return {
    type: RECEIVE_FALLBACK_GEO_DATA,
    payload: {
      fallback: {
        data,
      },
    },
  };
}

function handleError(error) {
  console.log('handle error');
  return {
    type: HANDLE_DATA_ERROR,
    error,
  };
}

export function getGeoLocationData(geoLocation) {
  const url = `${getFeedUrl()}/toi/web/config/geoinfo?geo=${geoLocation}`;
  return makeRequest.get(url);
}

export function loadGeoLocationData() {
  return dispatch => {
    if (Cookie.get('geolocation')) {
      getGeoLocationData(Cookie.get('geolocation'))
        .then(data => {
          if (!data.data) {
            // If in case city is not supported
            getGeoLocationData(DEFAULT_STATE).then(data1 => {
              dispatch(receiveFallBackGeoData(data1.data));
            });
          }
          dispatch(receiveCityData(data.data));
        })
        .catch(error => dispatch(handleError(error)));
    } else {
      getGeoLocationData(DEFAULT_STATE)
        .then(data => dispatch(receiveFallBackGeoData(data.data)))
        .catch(error => dispatch(handleError(error)));
    }
    if (Cookie.get('geostate')) {
      getGeoLocationData(Cookie.get('geostate'))
        .then(data => dispatch(receiveStateData(data.data)))
        .catch(error => dispatch(handleError(error)));
    }
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD_GEO_DATA:
      return {
        ...state,
        currentCountry: action.payload.currentCountry,
        currentContinent: action.payload.currentContinent,
        currentCity: action.payload.currentCity,
        currentRegion: action.payload.currentRegion,
      };

    case RECEIVE_STATE_DATA:
      return {
        ...state,
        stateData: action.payload.data,
      };
    case RECEIVE_CITY_DATA:
      return {
        ...state,
        cityData: action.payload.data,
      };
    case RECEIVE_FALLBACK_GEO_DATA:
      return {
        ...state,
        cityData:
          action.payload &&
          action.payload.fallback &&
          action.payload.fallback.data
            ? action.payload.fallback.data
            : {},
        fallback: action.payload.fallback,
      };
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
