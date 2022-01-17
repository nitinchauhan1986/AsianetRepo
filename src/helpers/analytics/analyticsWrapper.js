/* eslint-disable linebreak-style */
import { dimensionMapping } from '../../constants';

function callGa(...args) {
  if (typeof window !== 'undefined' && typeof window.ga === 'function') {
    window.ga(...args);
  }
}

function callGrx(...args) {
  //Stop the call -- GRX call is coming in EU region for webview
  if (
    typeof window !== 'undefined' &&
    typeof window.grx === 'function' &&
    !(
      window.location.href.indexOf('frmapp=yes') > 0 &&
      window.geoinfo &&
      window.geoinfo.Continent === 'EU'
    )
  ) {
    if (args[0] === 'track' && typeof args[2] === 'object') {
      const grxTrack = [];
      for (let i = 0; i < args.length; i += 1) {
        grxTrack.push(args[i]);
      }
      window.grx.apply(null, grxTrack);
    } else if (
      typeof args === 'object' &&
      (args[1] === 'event' || typeof args[1] === 'object')
    ) {
      const grxEvntObj = {
        category: typeof args[1] === 'object' ? args[1].eventCategory : args[2],
        action: typeof args[1] === 'object' ? args[1].eventAction : args[3],
        label: typeof args[1] === 'object' ? args[1].eventLabel : args[4],
      };
      const grxTrack = [
        'track',
        'event',
        grxEvntObj,
        args[5] && args[5].nonInteraction === 1,
      ];
      window.grx.apply(null, grxTrack);
    } else if (args[0] === 'userId' && args[1]) {
      window.grx('userId', args[1]);
    }

    if (typeof args === 'object' && args[1] === 'pageview') {
      const __ssoid =
        typeof document !== 'undefined' &&
        document.cookie.match(/(?:\s)?ssoid=(\w+);?/);
      if (__ssoid) {
        window.grx('userId', __ssoid[1]);
      }
      const grxTrack = [
        'track',
        'page_view',
        {
          url: args[2] || window.location.href,
          keywords: window.seoMetaKeywords,
          source: window.pageViewSource,
        },
      ];
      window.grx.apply(null, grxTrack);
    }

    if (typeof args === 'object' && args[0] === 'set') {
      const gaDimensionKey = args[1];
      const grxDimensionKey = dimensionMapping[gaDimensionKey];
      const grxTrack = ['set', grxDimensionKey, args[2]];
      window.grx.apply(null, grxTrack);
    }
  }
}

export default function analyticsWrapper(analyticsType, ...args) {
  if (analyticsType && args.length > 0) {
    switch (analyticsType) {
      case 'ga': {
        callGa(...args);
        break;
      }
      case 'grx': {
        callGrx(...args);
        break;
      }
      case 'gaAndGrx': {
        callGa(...args);
        callGrx(...args);
        break;
      }
      // eslint-disable-next-line no-empty
      default: {
      }
    }
  }
}
