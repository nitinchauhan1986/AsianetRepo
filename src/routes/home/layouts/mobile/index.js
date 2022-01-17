import React from 'react';
import MobileHome from "./MobileHome";

const pageName = 'Home';

async function action() {
  // const dataPromiseArray = [];
  // const localParams = { 0: context.path };
  // const hreflangArr = [
  //   { lang: 'en-us', url: 'https://m.timesofindia.com/us' },
  //   { lang: 'en-IN', url: 'https://m.timesofindia.com' },
  //   { lang: 'x-default', url: 'https://m.timesofindia.com' },
  // ];
  //
  // const isAppView = isApp(context.query);
  //
  // // existing state
  // // eslint-disable-next-line one-var
  // let state = context.store.getState(),
  //   sectionsNameList = [],
  //   cd8 = '';
  // const imageInfoObject = {};
  // const imageInfo = [];
  // let showPreload;
  // const isWapView = isWap(context.query) || isMobile() || state.isMobile;
  // const isPrime = !!state.isPrime;
  // const newParams = {
  //   ...localParams,
  //   curpg: 1,
  //   fullPath: '/',
  //   isWapView,
  //   isAppView,
  //   isPrime,
  //   // skipSubSections: isWapView,
  // };

  /*
  // Layout data calls start
  const layoutDataPromises = context.store.dispatch(
    loadLayoutData(
      {
        navigation: {
          ...newParams,
          path: context.path,
          isAppView,
          isWapView,
          clientRouting: context.clientRouting,
        },
        footer: newParams,
      },
      state,
    ),
  );
  dataPromiseArray.push(...layoutDataPromises);
  // Layout data calls end
  */
  // if (!state.homepage.data) {
  //   // dataPromiseArray.push(
  //   //   context.store.dispatch(loadIndiaHPData(mobileJSON, true)),
  //   // );
  //
  //   dataPromiseArray.push(
  //     context.store.dispatch(
  //       loadIndiaHPData({
  //         isWapView: true,
  //         isPrime,
  //         geocl: state.geocl,
  //         geolocation: state.ssrGeoCode,
  //       }),
  //     ),
  //   );
  //
  //   // dataPromiseArray.push(
  //   //   context.store.dispatch(
  //   //     loadElectionData({
  //   //       isWapView,
  //   //     }),
  //   //   ),
  //   // );
  // }
  // if (!state.homepage.cardsInserts)
  //   dataPromiseArray.push(context.store.dispatch(loadCardsInsert()));
  // if (!state.footer_v2.data || !state.header.data) {
  //   dataPromiseArray.push(
  //     context.store.dispatch(loadLayoutDataUSHP(newParams)),
  //   );
  // }
  //
  // if (typeof window === 'undefined') {
  //   dataPromiseArray.push(context.store.dispatch(getSiteConfig()));
  // }
  // // Layout data calls end
  //
  // // Route data calls start
  // const contextParams = context.params;
  //
  // // Route data calls end
  //
  // // wait for responses on server side
  // if (typeof window === 'undefined') {
  //   await Promise.all(dataPromiseArray);
  // }
  //
  // if (typeof window !== 'undefined') {
  //   window.categoryForGA = 'WAP-IN-NHP1';
  // }
  //
  // // get updated state
  // state = context.store.getState();
  // if (_get(state, 'navigation.data.breadCrumb', undefined)) {
  //   sectionsNameList = getSectionsListFromBreadCrumb(
  //     state.navigation.data.breadCrumbs,
  //   );
  //   cd8 = getCustomDimension8(sectionsNameList);
  //   // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$' + cd8);
  // }
  // const { query: { geolocation } = {} } = context;
  //
  // let status = 200;
  // const title = 'Get Latest News Updates from Times Of India';
  // const dataAvailable = true || !!state.homepage.data;
  //
  // if (typeof window === 'undefined' && !dataAvailable) {
  //   status = 404;
  // }
  // if (dataAvailable) {
  //   let leadTopStory = state.homepage.data.sections.filter(
  //     sec => sec.id === 'topstories',
  //   );
  //   if (
  //     leadTopStory &&
  //     leadTopStory[0] &&
  //     leadTopStory[0].items &&
  //     leadTopStory[0].items[0]
  //   ) {
  //     leadTopStory = leadTopStory[0].items[0];
  //   }
  //
  //   imageInfoObject.width = 600;
  //   imageInfoObject.id = leadTopStory.imageid;
  //   imageInfoObject.version = leadTopStory.imagesize || 12345;
  //   imageInfo.push(getImageFromImageObject(imageInfoObject));
  //   showPreload = typeof imageInfo !== 'undefined';
  //   showPreload = imageInfo instanceof Array && imageInfo.length > 0;
  // }

  const getComponent = pageTitle => {
    // if (typeof window === 'undefined' && !dataAvailable) {
    //   return (
    //     <div>
    //       Something went wrong. Click{' '}
    //       <a href="https://timesofindia.indiatimes.com">here</a> to browse TOI
    //     </div>
    //   );
    // }
    // const prebidObj = _get(
    //   state,
    //   `common.siteConfig.prebid.templates.ushome.mweb`,
    // );
    //
    // const electionFlag = _get(state, `common.siteConfig.showelection`);
    // context.store.dispatch(updatePrebidFlag(prebidObj));

    /*
    return <Videos isWapView={isWapView} />;
    */
    return (
      // <Layout
      //   title={pageTitle}
      //   params={newParams}
      //   query={Object.keys(context.query).length ? context.query : {}}
      //   adPosition="masthead"
      //   hideAdBlockerDetector
      //   showMiniTv
      //   pageType="Home"
      //   // showTimesTop10
      //   isCountrySwitchWidget
      //   showFBNInVideoModal
      //   l1Sections={l1Nav}
      //   showTOIPlus
      //   geolocation={state.ssrGeoCode}
      //   // showShortLogo
      //   showCovid19PopUp
      //   hideOpenInAppTopWidget
      //   useContentVisibilty
      // >
        <MobileHome/>
      // </Layout>
    );
  };
  return {
    title:'',
    chunks: ['homemobile'],
    seoData: {
      title:
        'News - Latest News, Breaking News, Bollywood, Sports, Business and Political News | Times of India',
      canonical: 'https://timesofindia.indiatimes.com',
      description:
        'Top News in India: Read Latest News on Sports, Business, Entertainment, Blogs and Opinions from leading columnists. Times of India brings the Breaking News and Latest News Headlines from India and around the World.',
      keywords:
        'News, Breaking news, Latest news, Live news, Today news, News Today, India news, English news, Politics news, Top news in India',
      ogimage: 'https://static.asianetnews.com/v1/icons/default/apple-icon-57x57.png',
      alternateApp:
        'android-app://com.toi.reader.activities/toi.index.deeplink/home',
      amplink: 'https://m.timesofindia.com/amp_home',
      hreflang: 'hreflangArr',
    },
    status:'',
    component: getComponent(),
    scrollRestoration: 'auto',
    maxAge: 60,
    gaData: {
      dimension9: pageName,
      dimension8: 'cd8',
    },
    headTags: [
    ],
  };
}

export default action;
