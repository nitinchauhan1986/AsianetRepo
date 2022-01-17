import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import pushNotification from 'helpers/pushnotification/pushnotification';
import loadAdsenseScript from 'helpers/ads/adsense';
import { popupManager } from 'utils/popupManager';
import WithCubeAd from 'modules/WithCubeAd/WithCubeAd';
import _get from 'lodash.get';
import WithAdBlockerDetector from 'components_v2/common/AdBlockerDetector/WithAdBlockerDetector';
import PrimePaymentFlowCaller from 'components/PrimePaymentFlow/PrimePaymentFlowCaller';
import AlreadyPrimeToastLoader from 'components/PrimeMessages/AlreadyPrimeToastLoader';
import PrimeWelcomePopupLoader from 'components/PrimeWelcomePopup/PrimeWelcomePopupLoader';
import { appendScriptToHead } from 'utils/DOMUtils';
import VideoModal from 'components_v2/mobile/VideoModal';
import BreakingNews from 'components_v2/mobile/BreakingNews';
import LazyStickyAffiliateNudge from 'routes/affiliates/components/molecules/StickyAffiliateNudge/LazyStickyAffiliateNudge';
import WithMiniTv from 'modules/WithMiniTv/WithMiniTv';
import { isGoogleBot } from 'utils/common';
import { isPrimeNotActive } from 'utils/primeUtil';
import Cookie from 'utils/cookies';
import WithBreakingNews from 'modules/WithBreakingNews';
import PrimeScreen from 'components/PrimePaymentFlow/PrimeScreen';
import { loadGeoData, loadGeoLocationData } from 'reduxUtils/modules/geo';
import { loadTranslationData } from 'reduxUtils/modules/translationConfig';
import { loadGdprData } from 'reduxUtils/modules/gdpr';
import { loadToiPlusConfig } from 'reduxUtils/modules/toiPlusConfig';
import miniTvStyle from 'components/MiniTv/UsPageMiniTvTheme.scss';
import { loadAllAdsFromQueue } from 'helpers/ads/redux';
import ConsentForm from 'components/Login/ConsentForm';
import LinksList from 'components_v2/mobile/LinksList';
import AdCaller from 'helpers/ads/adCaller';
import WithPopup from 'modules/WithPopup';
import AdFreeNudge from 'components/AdFreeNudge/';
import TimesTop10Loader from 'components/TimesTop10/TimesTop10Loader';
import Covid19 from 'components/Covid19SubscriptionWdt';
import WithWebViewLoginHook from 'components_v2/common/WebViewLoginHook/WithWebViewLoginHook';
import AdCube from 'components_v2/common/AdCube';
import ToiSubscriptionFlowCaller from 'components/ToiSubscription/ToiSubscriptionFlowCaller';
import { loadKillSwitchData } from 'reduxUtils/modules/toiplusKillSwitch';
import BreadCrumb from 'components_v2/common/BreadCrumb/BreadCrumb';
import { GEOAPI_URL } from '../../../constants';
import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer';

const Covid19LoaderWithPopup = WithPopup(Covid19);
const TimesTop10LoaderWithPopup = WithPopup(TimesTop10Loader);
const AdfreeNudgeWithPopup = WithPopup(AdFreeNudge);
// const GenderPopupLoaderWithPopup = WithPopup(GenderPopupLoader);

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.analticsScriptLoaded = false;
  }

  componentDidMount() {
    const { isWapView } = this.props.params;
    window.times = window.times || {};
    window.times.cookie = window.times.cookie || {};
    window.times.cookie.set = this.setCookie;
    const { geoinfo = {} } = window;
    if (typeof window.geoinfo === 'object') {
      this.props.loadGeoData(window.geoinfo);
    } else {
      appendScriptToHead({
        scriptUrl: GEOAPI_URL,
        callback: this.props.loadGeoLocationData,
      });
    }
    this.props.loadGeoLocationData();
    this.props.loadGdprData();
    this.loadAnalyticsScript();
    this.props.loadKillSwitchData(isWapView);
    this.props.loadAllAdsFromQueue('', window.location.pathname);
    popupManager(
      undefined,
      true,
      this.props.popGeoConfig.mweb,
      this.props.disablePopUpManager,
    );
    pushNotification.init();
    // window.showAdFreeNudge = this.showForceNudge;
    this.props.loadToiPlusConfig(
      this.props.isPrime,
      isWapView,
      geoinfo.Continent,
      geoinfo.region_code,
      geoinfo.CountryCode,
    );
    this.props.loadTranslationData(isWapView, geoinfo.CountryCode);
  }

  // showForceNudge = () => {
  //   this.setState({ showforcenudge: true });
  // };

  setCookie = (name, value, days, path, domain, secure) => {
    const updatedDomain =
      domain === '.indiatimes.com' ? '.timesofindia.com' : domain;
    Cookie.set(name, value, days, path, updatedDomain, secure);
  };

  loadAnalyticsScript() {
    if (!this.analticsScriptLoaded) {
      window.TimesGDPR.common.consentModule.gdprCallback(dataObj => {
        if (
          !dataObj.isEUuser ||
          (dataObj.isEUuser && dataObj.didUserOptOut === false) ||
          dataObj.userRegion === 'CA'
        ) {
          const script = document.createElement('script');
          script.setAttribute(
            'src',
            'https://static.clmbtech.com/ase/2658/39/aa.js',
          );
          script.setAttribute('async', 'async');
          document.body.appendChild(script);
          this.analticsScriptLoaded = true;
        }
      });
    }
  }

  componentDidUpdate() {
    this.loadAdsense();
    this.loadAnalyticsScript();
  }

  loadAdsense() {
    const { params, currentCountry } = this.props;
    const { isWapView } = params;
    if (
      typeof window === 'object' &&
      isWapView &&
      !this.state.adsenseScriptLoaded &&
      (typeof currentCountry === 'string' && currentCountry !== '') &&
      currentCountry !== 'IN' &&
      currentCountry !== 'AU'
    ) {
      this.setState({
        adsenseScriptLoaded: true,
      });
      loadAdsenseScript();
    }
  }

  // showPrimePopupWidget = propsToPass => {
  //   const frmapp = this.props.query && this.props.query.frmapp === 'yes';
  //   if (!frmapp) {
  //     return (
  //       <PrimeScreen
  //         // callBackForKillSwitch={this.callBackForKillSwitch}
  //         {...propsToPass}
  //         isWapView
  //       />
  //     );
  //   }
  //   return null;
  // };

  shouldShowAdFreeNudge = prcValue => {
    let shouldShow = false;
    if (typeof window === 'object' && isPrimeNotActive(prcValue)) {
      shouldShow = true;
    }
    return shouldShow;
  };

  getPrimeWidgets = () => {
    const { userData, showToiPlusNudges } = this.props;
    const prcValue =
      userData && userData.prcValue ? this.props.userData.prcValue : 0;

    // if (currentCountry === 'IN' || showToiplusNudges) {
    return (
      <>
        {/* {this.shouldShowAdFreeNudge(prcValue) && ( */}
        {showToiPlusNudges && (
          <AdfreeNudgeWithPopup
            userData={this.props.userData}
            page="home"
            prcValue={prcValue}
            theme="white_theme"
            showforcenudge={this.state.showforcenudge}
            isWapView
          />
        )}

        {/* {this.showPrimePopupWidget({
            componentName: 'BottomToast',
          })} */}

        {/* {this.showPrimePopupWidget({
            componentName: 'SubscribeNudge',
            theme: 'white_theme',
          })} */}
      </>
    );
    // }
    // return null;
  };

  render() {
    const {
      query,
      params,
      skipAds,
      skipFooter,
      adsCampaignStatus,
      mobileATFAdCode,
      mobileFBNAdCode,
      footerFanAdData,
      l1Sections,
      showTOIPlus,
      showShortLogo,
      headerData,
      commonData,
      killSwitchStatus,
      hideAds,
      hideTopSearch,
      headerLabel,
      showBreadcrumb,
      hideLogoMastHead,
      layoutClass,
    } = this.props;

    const topBandAdCodeObject = this.props.topBandAdCode
      ? this.props.topBandAdCode
      : _get(this.props, 'commonData.FIXED', undefined);
    const isRenderTopBand =
      topBandAdCodeObject &&
      (this.props.adPosition === 'masthead' || !this.props.adPosition);

    const { isWapView } = params;
    const frmapp = query.frmapp === 'yes';
    const atfAdCodeObject =
      mobileATFAdCode && mobileATFAdCode.adCode
        ? mobileATFAdCode
        : _get(this.props, 'commonData.atfAd');
    const fbnAdCodeObject =
      mobileFBNAdCode && mobileFBNAdCode.adCode
        ? mobileFBNAdCode
        : _get(this.props, 'commonData.fbnAd');
    const fanFbnAdCodeObject =
      footerFanAdData && footerFanAdData.placementId
        ? footerFanAdData
        : _get(this.props, 'commonData.fbnFanAd');
    const breadCrumb = _get(
      this.props,
      'headerData.navigation.breadcrumbs',
      undefined,
    );
    const overlayAtfad = _get(this.props, 'commonData.overlayAtfad');
    const overlayMrecAd = _get(this.props, 'commonData.overlayMrecAd');
    const overlayMrecAd1 = _get(this.props, 'commonData.overlayMrecAd1');
    const overlayFBNAd = _get(this.props, 'commonData.fbnAd');
    const topSearches = _get(this.props, 'commonData.topSearches');
    const underToneAd = _get(this.props, 'commonData.underTone');

    return (
      <div className={`${frmapp ? 'appView' : 'nonAppView'} ${layoutClass}`}>
        {!this.props.isPrime &&
          !this.props.params.hideMobileTopBar &&
          !this.props.hideAdCude && <AdCube isWapView={isWapView} />}
        {!hideAds &&
          isRenderTopBand &&
          !skipAds && (
            <AdCaller
              deviceType="mobile"
              className={s.banner}
              data={{
                ...topBandAdCodeObject,
                geo: _get(adsCampaignStatus, 'FIXED.geo', ''),
              }}
            />
          )}
        {this.props.showCovid19PopUp &&
          !this.props.covid19StickyView && (
            <Covid19LoaderWithPopup popupView={1} />
          )}

        {!isGoogleBot() && (
          <TimesTop10LoaderWithPopup popupView={1} isWapView />
        )}
        {/* <GenderPopupLoaderWithPopup isWapView /> */}
        {!frmapp && this.getPrimeWidgets()}
        {!frmapp && (
          <React.Fragment>
            {!hideTopSearch &&
              topSearches &&
              topSearches.items &&
              topSearches.items.length > 0 && (
                <div>
                  <LinksList
                    sectionData={{
                      ...topSearches,
                      data: [...topSearches.items],
                    }}
                    cssSelector="astrendinglist"
                    gaCategory={
                      this.props.pageType === 'ARTICLESHOW' &&
                      this.props.categoryForGA
                        ? `${this.props.categoryForGA}`
                        : 'ATF_seo_links'
                    }
                    gaAction={
                      this.props.pageType === 'ARTICLESHOW' &&
                      this.props.categoryForGA
                        ? 'click'
                        : 'link_###index###'
                    }
                    gaLabel={
                      this.props.pageType === 'ARTICLESHOW' &&
                      this.props.categoryForGA
                        ? 'topSearches'
                        : ''
                    }
                  />
                </div>
              )}
            <Header
              headerData={this.props.headerData}
              hideL2Navigation={this.props.hideL2Navigation}
              hideOpenInAppTopWidget={this.props.hideOpenInAppTopWidget}
              openappUrl={this.props.openappUrl || this.props.openInAppDll}
              isCountrySwitchWidget={this.props.isCountrySwitchWidget}
              currentCountry={this.props.currentCountry}
              l1Sections={l1Sections}
              showTOIPlus={showTOIPlus}
              showShortLogo={showShortLogo}
              hideLogoMastHead={hideLogoMastHead}
              underToneAd={underToneAd}
              userData={this.props.userData}
              killSwitchStatus={killSwitchStatus}
              hideAds={hideAds}
              geolocation={this.props.geolocation}
              gaCategory={this.props.gaCategory}
              headerType={this.props.headerType}
              headerLabel={headerLabel}
              showToiPlusEntryPoints={this.props.showToiPlusEntryPoints}
            />
          </React.Fragment>
        )}
        {this.props.pageType === 'Home' && (
          <PrimeScreen
            componentName="TopBand"
            theme="white_theme"
            isWapView={isWapView}
          />
        )}
        {!hideAds &&
          atfAdCodeObject &&
          !this.props.isPrime && (
            <div className="ATF_wrapper">
              <AdCaller
                deviceType="mobile"
                className="ATF_mobile_ads"
                data={atfAdCodeObject}
                immediateLoad
              />
            </div>
          )}
        {this.props.showMiniTv &&
          !frmapp && (
            <WithMiniTv
              isWapView
              styleObject={miniTvStyle}
              showMiniTvSection={this.props.showMiniTvSection}
            />
          )}
        <WithBreakingNews customComponent={BreakingNews} />

        {/* {!isMobile() && <WithBreakingNews />} */}
        <div
          className={`contentwrapper clearfix ${this.props.layoutType || ' '}`}
          ref={contentElement => {
            this.rhsElement = contentElement;
          }}
        >
          {this.props.children}
          {!frmapp &&
            !this.props.isPrime &&
            !this.props.params.hideMobileTopBar && (
              <WithCubeAd
                pageType={this.props.pageType}
                isWapView={isWapView}
              />
            )}
        </div>
        {!hideAds &&
          headerData &&
          headerData.sitesync && (
            <AdCaller
              deviceType="mobile"
              data={{
                ...headerData.sitesync,
              }}
              immediateLoad
            />
          )}
        {commonData &&
          commonData.geoAd && (
            <AdCaller
              immediateLoad
              data={commonData.geoAd}
              deviceType="mobile"
              cookieKey="geolocation"
            />
          )}
        {showBreadcrumb &&
          typeof breadCrumb !== 'undefined' && (
            <div className="breadcrumbmobile">
              <BreadCrumb data={breadCrumb} wrapperClass="breadcrumb" />
            </div>
          )}
        {!skipFooter && (
          <Footer
            footerData={this.props.footerData}
            params={this.props.params}
            isWapView={isWapView}
            frmapp={frmapp}
            hideStickyBackToTop={this.props.hideStickyBackToTop}
            fbnAdCodeObject={fbnAdCodeObject}
            fanFbnAdCodeObject={fanFbnAdCodeObject}
            footerWithOnlyFbn={params.hideMobileTopBar}
            hideFbn={this.props.hideFbn}
            // mobileFBNAdClass={this.props.mobileFBNAdClass}
            refreshFBNAd={this.props.refreshFBNAd}
            // pageType={this.props.pageType}
            currentCountry={this.props.currentCountry}
            hideBackToTop={this.props.hideBackToTop}
            hideAds={hideAds}
            isPrivateUser={this.props.isPrivateUser}
            useContentVisibilty={this.props.useContentVisibilty}
          />
        )}
        <WithWebViewLoginHook frmapp={frmapp} />
        <PrimePaymentFlowCaller />
        <ToiSubscriptionFlowCaller
          userData={this.props.userData}
          isWapView={isWapView}
          query={query}
          currencyCode={_get(this.props.translationData, 'currencyCode', '')}
        />
        <PrimeWelcomePopupLoader isWapView={isWapView} />
        <AlreadyPrimeToastLoader userData={this.props.userData} />
        {/* <WithVideoOverlay rhsref={this.rhsElement} /> */}
        {!this.props.hideAdBlockerDetector &&
          !this.props.isPrime && <WithAdBlockerDetector />}
        {this.props.isModalOpen && (
          <VideoModal
            adsData={{
              atfAd: overlayAtfad,
              mrecAds: [overlayMrecAd, overlayMrecAd1],
              fbnAd: overlayFBNAd,
            }}
            showFBN={this.props.showFBNInVideoModal}
            path={this.props.path}
          />
        )}
        {this.props.userData &&
          this.props.userData.showConsentPopUp && (
            <ConsentForm isPrivateUser={this.props.isPrivateUser} overlayView />
          )}
        <LazyStickyAffiliateNudge
          isMobile={isWapView}
          pageName={this.props.pageType.toLowerCase()}
          isAppView={frmapp}
          isPrime={this.props.isPrime}
          query={query}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isPrime: state.isPrime,
  isPrivateUser: state.gdpr.isPrivateUser,
  // adsQueueData: state.adCaller.adsQueueData,
  adsCampaignStatus: state.adCaller.adsCampaignStatus,
  userData: state.login.userData,
  currentCountry: _get(state, 'geo.currentCountry', undefined),
  headerData: state.header.data,
  footerData: state.footer_v2.data,
  commonData: state.commonData && state.commonData.data,
  isModalOpen: _get(state, 'videoModal.isModalOpen'),

  openappUrl:
    state.navigation && state.navigation.openappUrl
      ? state.navigation.openappUrl
      : '',
  killSwitchStatus:
    state.toipluskillswitch && state.toipluskillswitch.killSwitchStatus,
  showToiPlusEntryPoints: _get(
    state,
    'toiplusconfig.showToiPlusEntryPoints',
    false,
  ),
  showToiPlusNudges: state.toiplusconfig?.showToiPlusNudges,
  translationData: _get(state, 'translationConfig.data', {}),
  popGeoConfig: _get(state, 'common.siteConfig.popup', {
    mweb: {
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
  loadGeoData: params => {
    dispatch(loadGeoData(params));
  },
  loadGeoLocationData: params => {
    dispatch(loadGeoLocationData(params));
  },
  loadKillSwitchData: params => {
    dispatch(loadKillSwitchData(params));
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
  isPrime: PropTypes.bool.isRequired,
  pageType: PropTypes.string,
  children: PropTypes.node.isRequired,
  query: PropTypes.shape({}).isRequired,
  translationData: PropTypes.shape({}),
  params: PropTypes.shape({
    fullPath: PropTypes.string.isRequired,
    hideMobileTopBar: PropTypes.bool,
    liveblogHeader: PropTypes.bool,
    refreshAtfAd: PropTypes.bool,
    isWapView: PropTypes.bool,
  }).isRequired,
  userData: PropTypes.shape({
    showConsentPopUp: PropTypes.bool,
  }),
  loadGdprData: PropTypes.func.isRequired,
  loadGeoData: PropTypes.func.isRequired,
  loadGeoLocationData: PropTypes.func.isRequired,
  loadAllAdsFromQueue: PropTypes.func.isRequired,
  layoutType: PropTypes.string,
  hideStickyBackToTop: PropTypes.bool,
  mobileAdCode: PropTypes.shape({}),
  mobileFBNAdCode: PropTypes.shape({}),
  showMiniTv: PropTypes.bool,
  showMiniTvSection: PropTypes.string,
  refreshFBNAd: PropTypes.bool,
  hideAdBlockerDetector: PropTypes.bool,
  isPrivateUser: PropTypes.bool,
  currentCountry: PropTypes.string,
  headerData: PropTypes.shape({
    sitesync: PropTypes.shape({}),
  }),
  commonData: PropTypes.shape({}),
  footerData: PropTypes.shape({}),
  isModalOpen: PropTypes.bool,
  hideL2Navigation: PropTypes.bool,
  hideOpenInAppTopWidget: PropTypes.bool,
  // showTimesTop10: PropTypes.bool,
  adPosition: PropTypes.string,
  topBandAdCode: PropTypes.shape({}),
  adsCampaignStatus: PropTypes.shape({}),
  mobileATFAdCode: PropTypes.shape({}),
  footerFanAdData: PropTypes.shape({}),
  fbnAdsData: PropTypes.shape({}),
  skipAds: PropTypes.bool,
  openappUrl: PropTypes.string,
  skipFooter: PropTypes.bool,
  isCountrySwitchWidget: PropTypes.bool,
  hideBackToTop: PropTypes.bool,
  showFBNInVideoModal: PropTypes.bool,
  l1Sections: PropTypes.arrayOf(PropTypes.shape({})),
  showTOIPlus: PropTypes.bool,
  showShortLogo: PropTypes.bool,
  hideFbn: PropTypes.bool,
  loadKillSwitchData: PropTypes.func.isRequired,
  killSwitchStatus: PropTypes.objectOf({}),
  hideAds: PropTypes.bool,
  hideTopSearch: PropTypes.bool,
  geolocation: PropTypes.string,
  showCovid19PopUp: PropTypes.bool,
  covid19StickyView: PropTypes.bool,
  gaCategory: PropTypes.string,
  openInAppDll: PropTypes.string,
  categoryForGA: PropTypes.string,
  headerType: PropTypes.string,
  headerLabel: PropTypes.string,
  loadToiPlusConfig: PropTypes.func.isRequired,
  loadTranslationData: PropTypes.func.isRequired,
  showToiPlusEntryPoints: PropTypes.bool,
  useContentVisibilty: PropTypes.bool,
  showBreadcrumb: PropTypes.bool,
  hideLogoMastHead: PropTypes.bool,
  showToiPlusNudges: PropTypes.bool,
  disablePopUpManager: PropTypes.bool,
  layoutClass: PropTypes.string,
  hideAdCude: PropTypes.bool,
};

Layout.defaultProps = {
  pageType: '',
  userData: undefined,
  translationData: {},
  layoutType: '',
  headerType: '',
  headerLabel: '',
  hideStickyBackToTop: false,
  hideFbn: false,
  mobileAdCode: undefined,
  mobileFBNAdCode: undefined,
  commonData: {},
  //adsCampaignStatusUrl: undefined,
  //hideBreadcrumAtBottom: false,
  //mobileFBNAdClass: '',
  showMiniTv: false,
  showMiniTvSection: '',
  refreshFBNAd: false,
  hideAdBlockerDetector: false,
  //pageType: '',
  //subSecSeoLocation: '',
  isPrivateUser: true,
  currentCountry: undefined,
  headerData: undefined,
  footerData: undefined,
  isModalOpen: undefined,
  hideL2Navigation: false,
  hideOpenInAppTopWidget: true,
  // showTimesTop10: false,
  adsCampaignStatus: undefined,
  adPosition: '',
  topBandAdCode: undefined,
  mobileATFAdCode: {},
  footerFanAdData: {},
  fbnAdsData: {},
  skipAds: false,
  openappUrl: '',
  skipFooter: false,
  isCountrySwitchWidget: false,
  hideBackToTop: false,
  showFBNInVideoModal: false,
  l1Sections: [],
  showTOIPlus: false,
  showShortLogo: false,
  killSwitchStatus: null,
  hideAds: false,
  hideTopSearch: false,
  geolocation: '1',
  showCovid19PopUp: false,
  covid19StickyView: false,
  gaCategory: undefined,
  openInAppDll: '',
  categoryForGA: '',
  showToiPlusEntryPoints: false,
  useContentVisibilty: false,
  showBreadcrumb: false,
  hideLogoMastHead: false,
  showToiPlusNudges: false,
  disablePopUpManager: false,
  layoutClass: '',
  hideAdCude: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
