import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _get from 'lodash.get';
// import { appendScriptToHead } from 'utils/DOMUtils';
// // import { isGoogleBot, isTablet } from 'utils/common';
// import { loadToiPlusConfig } from 'reduxUtils/modules/toiPlusConfig';
// import { loadTranslationData } from 'reduxUtils/modules/translationConfig';
// import { loadKillSwitchData } from 'reduxUtils/modules/toiplusKillSwitch';
// import { GEOAPI_URL } from '../../../constants';

// eslint-disable-next-line no-unused-vars
// import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer';
// import { loadGdprData } from '../../../reduxUtils/modules/gdpr';
// import {
//   loadGeoData,
//   loadGeoLocationData,
// } from '../../../reduxUtils/modules/geo';
// import RenderAds from '../../../routes/home/components/desktop/RenderAds/RenderAds';

// const Covid19LoaderWithPopup = WithPopup(Covid19);
// const AdfreeNudgeWithPopup = WithPopup(AdFreeNudge);
// const TimesTop10LoaderWithPopup = WithPopup(TimesTop10Loader);
// const GenderPopupLoaderWithPopup = WithPopup(GenderPopupLoader);

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.analticsScriptLoaded = false;
  }

  componentDidMount() {
    const { isWapView } = this.props;
    const { geoinfo = {} } = window;
    if (typeof window.geoinfo === 'object') {
      this.props.loadGeoData(window.geoinfo);
    } else {
      appendScriptToHead({
        scriptUrl: GEOAPI_URL,
        callback: this.props.loadGeoLocationData,
      });
    }
    this.props.loadGeoLocationData(isWapView);
    this.props.loadGdprData();
    this.props.loadKillSwitchData(isWapView);
    this.loadAnalyticsScript();
    this.props.loadAllAdsFromQueue('', '');
    popupManager(
      undefined,
      false,
      this.props.popGeoConfig.web,
      this.props.disablePopUpManager,
    );
    pushNotification.init({ isCoachMark: true });
    if (this.props.adsCampaignStatusUrl) {
      this.props.loadAdsCampaignStatus(this.props.adsCampaignStatusUrl);
    }
    this.props.loadToiPlusConfig(
      this.props.isPrime,
      isWapView,
      geoinfo.Continent,
      geoinfo.region_code,
      geoinfo.CountryCode,
    );
    this.props.loadTranslationData(isWapView, geoinfo.CountryCode);
    // window.showAdFreeNudge = this.showForceNudge;
  }

  // showForceNudge = () => {
  //   this.setState({ showforcenudge: true });
  // };

  componentDidUpdate() {
    this.loadAnalyticsScript();
  }




  render() {
    // eslint-disable-next-line react/prop-types
    const {
      query,
      params,
      SidebarComponent,
      hideCyclicNav,
      l2navigationChild,
      desktopAdCode,
      headerData,
      layoutClass,
      commonData,
      showWeatherInC,
      enablePrimeFlow,
      isPrime,
      killSwitchStatus,
      hideAds,
      adsCampaignStatus,
      skipAds,
      pageType,
      hideLogoMastHead,
    } = this.props;
    const { isWapView } = params;
    const frmapp = query.frmapp === 'yes';
    const viewClass = frmapp ? 'appView' : 'nonAppView';
    let headerAdCode;
    if (desktopAdCode && desktopAdCode.adCode) {
      headerAdCode = desktopAdCode;
    } else if (commonData && commonData.ROS) {
      headerAdCode = commonData.ROS;
    }
    const isSingleGutterFallbackAd =
      this.props.gutterFallbackAdObject &&
      !this.props.gutterFallbackAdObject.lhs &&
      !this.props.gutterFallbackAdObject.rhs;
    const topBandAdCodeObject = this.props.topBandAdCode
      ? this.props.topBandAdCode
      : _get(this.props, 'commonData.FIXED', undefined);
    const isRenderTopBand =
      topBandAdCodeObject &&
      (!this.props.adsCampaignStatusUrl ||
        (adsCampaignStatus && _get(adsCampaignStatus, 'FIXED.status') === 1)) &&
      (this.props.adPosition === 'masthead' || !this.props.adPosition);

    return (
      <div className={`${viewClass} ${layoutClass}`}>

        {!frmapp && (
          <>
            <Header
              isWapView={isWapView}
              isPrime={isPrime}
              hideCyclicNav={hideCyclicNav}
              l2navigationChild={l2navigationChild}
              headerData={headerData}
              hideTimesPointPopup={this.props.hideTimesPointPopup}
              showWeatherInC={showWeatherInC}
              enablePrimeFlow={enablePrimeFlow}
              pageType={this.props.pageType}
              killSwitchStatus={killSwitchStatus}
              geolocation={this.props.geolocation}
              showToiPlusEntryPoints={this.props.showToiPlusEntryPoints}
              hideLogoMastHead={hideLogoMastHead}
              colorTheme={this.props.colorTheme}
            />
          </>
        )}

        <div
          className={`contentwrapper clearfix ${this.props.layoutType || ' '} ${
            this.props.customclasslayoutwrapper
              ? this.props.customclasslayoutwrapper
              : ''
          }`}
        >
          {this.props.children}
        </div>

        <Footer
              footerData={this.props.footerData}
                isPrivateUser={this.props.isPrivateUser}
              />


      </div>
    );
  }
}

const mapStateToProps = state => ({
  isPrime: state.isPrime,
  sidebarData: state.sidebar ? state.sidebar.data : {},
  headerData: state.header?.data,
  //footer: state.footer,
  isPrivateUser: state.gdpr.isPrivateUser,
  // adsQueueData: state.adCaller.adsQueueData,
  consentGiven: !(
    state.login.userData && state.login.userData.showConsentPopUp
  ),
  userData: _get(state, 'login.userData', {}),
  currentCountry: _get(state, 'geo.currentCountry', undefined),
  navigationData: state.header?.data,
  footerData: state.footer_v2?.data,
  commonData: state.commonData?.data,
  showGutterFallback: state.common && state.common.showGutterFallback,
  gutterFallbackAdObject: state.common && state.common.gutterFallbackAdObject,
  killSwitchStatus: state.toipluskillswitch?.killSwitchStatus,
  adsCampaignStatus: state.adCaller.adsCampaignStatus,
  showToiPlusEntryPoints: _get(
    state,
    'toiplusconfig.showToiPlusEntryPoints',
    false,
  ),
  showToiPlusNudges: state.toiplusconfig?.showToiPlusNudges,
  translationData: _get(state, 'translationConfig.data', {}),
  popGeoConfig: _get(state, 'common.siteConfig.popup', {
    web: {
      enabled: 1,
      geo: {
        IN: '1',
        US: '1',
        ROW: '1',
      },
    },
  }),
});

const mapDispatchToProps = dispatch => ({
  loadAllAdsFromQueue: (params, path) => {
    dispatch(loadAllAdsFromQueue(params, path));
  },
  loadGdprData: params => {
    dispatch(loadGdprData(params));
  },
  loadKillSwitchData: params => {
    dispatch(loadKillSwitchData(params));
  },
  loadGeoData: params => {
    dispatch(loadGeoData(params));
  },
  loadGeoLocationData: params => {
    dispatch(loadGeoLocationData(params));
  },
  loadAdsCampaignStatus: url => {
    dispatch(loadAdsCampaignStatus(url));
  },
  loadToiPlusConfig: (
    isPrime,
    isWapView,
    currentContinent,
    currentRegion,
    currentCountry,
  ) => {
    dispatch(
      loadToiPlusConfig(
        isPrime,
        isWapView,
        currentContinent,
        currentRegion,
        currentCountry,
      ),
    );
  },
  loadTranslationData: (isWapView, currentCountry) => {
    dispatch(loadTranslationData(isWapView, currentCountry));
  },
});

Layout.propTypes = {
  layoutClass: PropTypes.string,
  isPrime: PropTypes.bool.isRequired,
  pageType: PropTypes.string,
  SidebarComponent: PropTypes.shape({}),
  translationData: PropTypes.shape({}),
  l2navigationChild: PropTypes.shape({}),
  children: PropTypes.node.isRequired,
  headerData: PropTypes.shape({}).isRequired,
  sidebarData: PropTypes.arrayOf(PropTypes.shape({})),
  query: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({
    fullPath: PropTypes.string.isRequired,
    hideMobileTopBar: PropTypes.bool,
    liveblogHeader: PropTypes.bool,
    refreshAtfAd: PropTypes.bool,
  }).isRequired,
  consentGiven: PropTypes.bool,
  loadGdprData: PropTypes.func.isRequired,
  loadKillSwitchData: PropTypes.func.isRequired,
  loadGeoData: PropTypes.func.isRequired,
  loadGeoLocationData: PropTypes.func.isRequired,
  loadAllAdsFromQueue: PropTypes.func.isRequired,
  layoutType: PropTypes.string,
  footerData: PropTypes.shape({}),
  desktopAdCode: PropTypes.shape({}),
  //subSecSeoLocation: PropTypes.string,
  isPrivateUser: PropTypes.bool,
  // currentCountry: PropTypes.string,
  commonData: PropTypes.shape({ gutterAd: PropTypes.shape({}) }),
  hideAdBlockerDetector: PropTypes.bool,
  hideCyclicNav: PropTypes.bool,
  hideGutterAd: PropTypes.bool,
  showGutterFallback: PropTypes.bool,
  gutterFallbackAdObject: PropTypes.shape({
    lhs: PropTypes.shape({}),
    rhs: PropTypes.shape({}),
  }),
  hideTimesPointPopup: PropTypes.bool,
  showMiniTv: PropTypes.bool,
  showMiniTvSection: PropTypes.string,
  showWeatherInC: PropTypes.bool,
  enablePrimeFlow: PropTypes.bool,
  miniTvV2: PropTypes.bool,
  overRideClass: PropTypes.string,
  userData: PropTypes.shape({
    showConsentPopUp: PropTypes.bool,
  }),
  killSwitchStatus: PropTypes.objectOf({}),
  hideAdCude: PropTypes.bool,
  customclasslayoutwrapper: PropTypes.string,
  hideAds: PropTypes.bool,
  geolocation: PropTypes.string,
  adsCampaignStatusUrl: PropTypes.string,
  loadAdsCampaignStatus: PropTypes.func.isRequired,
  adsCampaignStatus: PropTypes.shape({}),
  topBandAdCode: PropTypes.shape({}),
  adPosition: PropTypes.string,
  skipAds: PropTypes.bool,
  showCovid19PopUp: PropTypes.bool,
  covid19StickyView: PropTypes.bool,
  loadToiPlusConfig: PropTypes.func.isRequired,
  loadTranslationData: PropTypes.func.isRequired,
  isWapView: PropTypes.bool,
  showToiPlusEntryPoints: PropTypes.bool,
  hideLogoMastHead: PropTypes.bool,
  showToiPlusNudges: PropTypes.bool,
  disablePopUpManager: PropTypes.bool,
  colorTheme: PropTypes.string,
};

Layout.defaultProps = {
  layoutClass: '',
  pageType: '',
  SidebarComponent: undefined,
  l2navigationChild: undefined,
  consentGiven: true,
  sidebarData: [],
  layoutType: '',
  translationData: {},
  //adTheme: '',
  //hideStickyBackToTop: false,
  //mobileAdCode: undefined,
  desktopAdCode: undefined,
  overRideClass: '',
  //topBandAdCode: undefined,
  //adsCampaignStatus: undefined,
  adsCampaignStatusUrl: undefined,
  //hideBreadcrumAtBottom: false,
  showMiniTv: false,
  //deskopTopBannerData: undefined,
  //refreshFBNAd: false,
  hideAdBlockerDetector: false,
  hideCyclicNav: false,
  //pageType: '',
  //subSecSeoLocation: '',
  isPrivateUser: true,
  // currentCountry: '',
  //navigationData: undefined,
  footerData: undefined,
  commonData: {},
  hideGutterAd: false,
  showGutterFallback: false,
  gutterFallbackAdObject: undefined,
  hideTimesPointPopup: false,
  showMiniTvSection: '',
  showWeatherInC: false,
  enablePrimeFlow: false,
  miniTvV2: true,
  userData: undefined,
  killSwitchStatus: null,
  hideAdCude: false,
  customclasslayoutwrapper: '',
  hideAds: false,
  geolocation: '1',
  adsCampaignStatus: undefined,
  topBandAdCode: undefined,
  adPosition: '',
  skipAds: false,
  showCovid19PopUp: false,
  covid19StickyView: false,
  isWapView: false,
  showToiPlusEntryPoints: false,
  hideLogoMastHead: false,
  showToiPlusNudges: false,
  disablePopUpManager: false,
  colorTheme: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
