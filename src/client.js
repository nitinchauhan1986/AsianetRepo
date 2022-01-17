/* eslint-disable func-names */
import React from 'react';
import ReactDOM from 'react-dom';
import deepForceUpdate from 'react-deep-force-update';
import queryString from 'query-string';
import { createPath } from 'history';
// import {
//   openOverlayDockedMode,
//   turnDimOff,
// } from 'modules/WithVideoOverlay/redux';
import { refreshAdsFromRefreshableList } from 'helpers/ads/redux';
import Cookie from 'utils/cookies';
import App from './components/App';
import configureStore from './store/configureStore';
import history from './history';
// import { updateMeta } from './utils/DOMUtils';
import CustomUniveralRouter from './router';
import { clearSearchData } from './reduxUtils/modules/videosearch';
import {
  sanitizeQueryParams,
  disableAppInit,
  routeChangeHandlings,
  isTablet,
  isIE,
} from './utils/common';
import loadFonts from './utils/loadFonts';

import { savingsApi } from './helpers/analytics/savingsapi';
import { closestPolyfill } from './utils/polyfills';

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
  // Initialize a new Redux store
  // http://redux.js.org/docs/basics/UsageWithReact.html
  store: configureStore(window.App.state, { history }),
  storeSubscription: null,
};

// eslint-disable-next-line consistent-return
(function () {
  if (typeof window.CustomEvent === 'function' && !isIE()) return false; //If not IE

  function CustomEvent(event, param) {
    const params = param || {
      bubbles: false,
      cancelable: false,
      detail: undefined,
    };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail,
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
  window.Event = CustomEvent;
})();

closestPolyfill();

Cookie.remove('gaabtest2', '/', 'localhost');

// initChartBeat();

const container = document.getElementById('app');
let currentLocation = history.location;
let appInstance;

const scrollPositionsHistory = {};

// Re-render the app when window.location changes
async function onLocationChange(location, action) {
  window.historyArray.push(location.pathname);
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };
  // Delete stored scroll position for next page if any
  if (action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }
  currentLocation = location;
  const isInitialRender = !action;
  try {
    context.pathname = location.pathname;
    context.query = sanitizeQueryParams(queryString.parse(location.search));
    context.clientRouting = !isInitialRender;
    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.
    const route = await CustomUniveralRouter(context, window.App.state).resolve(
      context,
    );

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return;
    }

    if (route.redirect) {
      history.replace(route.redirect);
      return;
    }

    // check if there is a dom element refrence that was set from page you are navigating away from
    // if (!route.videoshow) {
    //   context.store.dispatch(openOverlayDockedMode(undefined));
    //   context.store.dispatch(turnDimOff());
    // }
    routeChangeHandlings(context, isInitialRender);
    context.store.dispatch(clearSearchData());
    const renderReactApp = isInitialRender ? ReactDOM.hydrate : ReactDOM.render;
    appInstance = renderReactApp(
      <App context={context}>{route.component}</App>,
      container,
      () => {
        if (isInitialRender) {
          // Switch off the native scroll restoration behavior and handle it manually
          // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
          if (window.history && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration =
              route.scrollRestoration || 'manual';
          }

          const elem = document.getElementById('css');
          if (elem) elem.parentNode.removeChild(elem);
          return;
        }

        document.title = route.title;

        // updateMeta('description', route.description);
        // Update necessary tags in <head> at runtime here, ie:
        // updateMeta('keywords', route.keywords);
        // updateCustomMeta('og:url', route.canonicalUrl);
        // updateCustomMeta('og:image', route.imageUrl);
        // updateLink('canonical', route.canonicalUrl);
        // etc.

        let scrollX = 0;
        let scrollY = 0;
        const pos = scrollPositionsHistory[location.key];
        if (pos) {
          scrollX = pos.scrollX;
          scrollY = pos.scrollY;
        } else {
          const targetHash = location.hash.substr(1);
          if (targetHash) {
            const target = document.getElementById(targetHash);
            if (target) {
              scrollY = window.pageYOffset + target.getBoundingClientRect().top;
            }
          }
        }

        // Restore the scroll position if it was saved into the state
        // or scroll to the given #hash anchor
        // or scroll to top of the page
        window.scrollTo(scrollX, scrollY);

        // Google Analytics tracking. Don't send 'pageview' event after
        // the initial rendering, as it was already sent
        if (window.ga) {
          if (window.TimesGA && window.TimesGA.setGAParams) {
            window.TimesGA.setGAParams(route.gaData || {});
          }
          window.ga('send', 'pageview', createPath(location));
        }
        context.store.dispatch(refreshAdsFromRefreshableList());
      },
    );
  } catch (error) {
    if (__DEV__) {
      throw error;
    }

    //console.error(error);

    // Do a full page reload if error occurs during client-side navigation
    if (!isInitialRender && currentLocation.key === location.key) {
      console.error('RSK will reload your page after error');
      window.location.reload();
    }
  }
}
window.historyArray = [];
// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
// disable init app/routing for unsupported domains
if (!disableAppInit()) {
  history.listen(onLocationChange);
  onLocationChange(currentLocation);
}

loadFonts();
if (window.App.state.isMobile) {
  global.isMobileUserAgent = true;
}

if (window.TimesGDPR && window.TimesGDPR.common.consentModule.gdprCallback) {
  window.TimesGDPR.common.consentModule.gdprCallback((dataObj) => {
    if (!dataObj.isEUuser && window.App.state.isPrime) {
      savingsApi();
      window.TimesApps.SavingsAPI.initializeApi();
    }
  });
}

//console.log(object);
let deviceClass = '';
if (isTablet()) {
  deviceClass = 'tablet';
} else if (window.App.state.isMobile) {
  deviceClass = 'mobile';
}

if (deviceClass) {
  document.body.setAttribute('devicetype', deviceClass);
}

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./router', () => {
    if (appInstance && appInstance.updater.isMounted(appInstance)) {
      // Force-update the whole tree, including components that refuse to update
      deepForceUpdate(appInstance);
    }

    onLocationChange(currentLocation);
  });
}
