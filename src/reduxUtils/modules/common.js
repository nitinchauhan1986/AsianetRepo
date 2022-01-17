/* eslint-disable import/prefer-default-export */
// import axios from 'axios';
import makeRequest from 'utils/makeRequest';
import reducerRegistry from '../../reduxUtils/reducerRegistry';

const reducerName = 'common';
const createActionName = name => `toi/${reducerName}/${name}`;

// actions
export const SET_RUNTIME_VARIABLE = createActionName('SET_RUNTIME_VARIABLE');
export const TOGGLE_OPEN_IN_APP = createActionName('TOGGLE_OPEN_IN_APP');
export const SET_THEME_BY_OPTIMIZELY = createActionName(
  'SET_THEME_BY_OPTIMIZELY',
);
export const SET_SITE_CONFIG = createActionName('SET_SITE_CONFIG');

export const SET_SOCIAL_SHARE_STATE = createActionName(
  'SET_SOCIAL_SHARE_STATE',
);

export const SET_GUTTER_FALLBACK = createActionName('SET_GUTTER_FALLBACK');

export function setRuntimeVariable({ name, value }) {
  return {
    type: SET_RUNTIME_VARIABLE,
    payload: {
      name,
      value,
    },
  };
}

export function toggleOpenInApp(isShown) {
  return {
    type: TOGGLE_OPEN_IN_APP,
    payload: {
      isShown,
    },
  };
}
export function setThemeByOptimizely(newTheme) {
  return {
    type: SET_THEME_BY_OPTIMIZELY,
    payload: {
      newTheme,
    },
  };
}

export function setSocialShareTrayStatus(status) {
  return {
    type: SET_SOCIAL_SHARE_STATE,
    payload: {
      status,
    },
  };
}

export function setGutterFallback(showGutterFallback, gutterFallbackAdObject) {
  return {
    type: SET_GUTTER_FALLBACK,
    payload: {
      showGutterFallback,
      gutterFallbackAdObject,
    },
  };
}

function fetchSiteConfig() {
  const endpoint = '/site_settings/feedtype-json.cms';
  return makeRequest.get(
    endpoint,
    {
      params: {},
    },
    'skipfeedengine',
  );
}

function receiveSiteConfig(data) {
  return {
    type: SET_SITE_CONFIG,
    payload: {
      data,
    },
  };
}

function handleSiteConfigError() {
  return {
    type: SET_SITE_CONFIG,
    payload: {
      data: {},
    },
  };
}

export function getSiteConfig() {
  return dispatch =>
    fetchSiteConfig()
      .then(data => {
        dispatch(receiveSiteConfig(data.data));
      })
      .catch(error => {
        dispatch(handleSiteConfigError(error));
      });
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_RUNTIME_VARIABLE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case TOGGLE_OPEN_IN_APP:
      return {
        ...state,
        openInAppBtnVisible: action.payload.isShown,
      };
    case SET_THEME_BY_OPTIMIZELY:
      return {
        ...state,
        newTheme: action.payload.newTheme,
      };
    case SET_SITE_CONFIG:
      return {
        ...state,
        siteConfig: action.payload.data,
      };
    case SET_SOCIAL_SHARE_STATE: {
      return {
        ...state,
        socialShareTrayStatus: action.payload.status,
      };
    }
    case SET_GUTTER_FALLBACK: {
      return {
        ...state,
        showGutterFallback: action.payload.showGutterFallback,
        gutterFallbackAdObject: action.payload.gutterFallbackAdObject,
      };
    }
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
