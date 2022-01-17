import React from 'react';
import _get from 'lodash.get';
// import {
//   loadIndiaHPData,
//   // loadElectionData,
//   loadCardsInsert,
// } from 'routes/home/layouts/India/redux';
import { commonHeadScripts } from 'helpers/scripts/headScripts';
// import { loadLayoutDataUSHP } from 'reduxUtils/modules_v2/layout';
// import { updatePrebidFlag } from 'helpers/ads/redux';
// import { getSiteConfig } from 'reduxUtils/modules/common';
// import Layout from 'components_v2/desktop/Layout';

import Home from './Home';
// import desktopJSON from '../data/desktop';

const pageName = 'Home';

async function action(context) {
  const getComponent = (pageTitle) => {
    return <Home />;
  };

  return {
    title: '',
    chunks: ['homedesktop'],
    seoData: {
      title:
        'This is dummy News - Latest News, Breaking News, Bollywood, Sports, Business and Political News',
      canonical: 'https://asianetnews.com/',
      description: 'News Description',
      keywords: 'News Key Words',
      ogimage: 'https://static.toiimg.com/photo/47529300.cms',
      alternate: 'https://asianetnews.com/',
      alternateApp:
        'android-app://com.toi.reader.activities/toi.index.deeplink/HomeL1/Top-01',
      amplink: '',
      hreflang: '',
    },
    gutterType: 'v2',
    status: '',
    component: getComponent(),
    scrollRestoration: 'auto',
    maxAge: 60,
    gaData: {
      dimension9: pageName,
      dimension8: '',
    },
    preconnectDomains: ['//tpapi.timespoints.com'],
    skipGpt: true,
    headTags: [...commonHeadScripts],
  };
}

export default action;
