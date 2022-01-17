import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazy-load';
import Cookie from 'utils/cookies';
import { setGutterFallback } from 'reduxUtils/modules/common';
import _get from 'lodash.get';
import AdDiv from './AdDiv';
import CtnAdDiv from './CtnAdDiv';
import CtnDfpAdDiv from './CtnDfpAdDiv';
import { addToQueue, loadAllAdsFromQueue } from './redux';

class AdCaller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reloadAd: false,
      refreshInitDone: false,
    };
    this.adData = {};
  }
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    loadAllAdsFromQueue: PropTypes.func.isRequired,
    lazyload: PropTypes.bool,
    isPrime: PropTypes.bool.isRequired,
    deviceType: PropTypes.string,
    isCTN: PropTypes.bool,
    navigation: PropTypes.shape({}),
    pauseAdCall: PropTypes.bool,
  };
  static defaultProps = {
    lazyload: false,
    deviceType: '',
    isCTN: false,
    navigation: {},
    pauseAdCall: false,
  };
  shouldComponentUpdate() {
    if (this.props.inlineGptAd) {
      return false;
    }
    return true;
  }
  gutterFallbackEvent = event => {
    if (event) {
      this.props.setGutterFallback(
        event.showGutterFallback,
        event.gutterFallbackAdObject,
      );
    }
  };
  componentDidMount() {
    const { data } = this.props;
    if (this.props.immediateLoad && !this.props.inlineGptAd) {
      const path =
        (this.props.navigation &&
          this.props.navigation.data &&
          this.props.navigation.data.path) ||
        '';
      this.props.loadAllAdsFromQueue('', path);
    }
    window.addEventListener(
      'SET_GUTTER_FALLBACK',
      this.gutterFallbackEvent.bind(this),
    );

    const currentCountry = Cookie.get('geo_country');

    if (
      data &&
      data.reload &&
      data.reload.interval &&
      data.reload.interval.geo &&
      data.reload.adCode
    ) {
      const interval = data.reload.interval.geo[currentCountry || 'ROS'] || 0;
      if (interval > 0) {
        setTimeout(() => {
          this.setState({
            reloadAd: true,
          });
        }, interval);
      }
    }
    this.attachAdsEvent();
  }

  componentWillUnmount() {
    clearInterval(this.refreshIntervalRef);
  }

  componentDidUpdate(prevProps, prevState) {
    //const { data: { refreshV2 } } = this.props;
    const { data = {} } = this.props;
    const { refreshV2 } = data;
    const path =
      (this.props.navigation &&
        this.props.navigation.data &&
        this.props.navigation.data.path) ||
      '';
    if (
      this.state.reloadAd !== prevState.reloadAd ||
      (prevProps.pauseAdCall && !this.props.pauseAdCall)
    ) {
      setTimeout(() => {
        this.props.loadAllAdsFromQueue('', path);
      }, 500);
    }

    if (
      refreshV2 &&
      !Number.isNaN(parseInt(refreshV2, 10)) &&
      refreshV2 > 0 &&
      !this.state.refreshInitDone &&
      typeof this.adData.adCodeObj === 'object' &&
      typeof this.adData.adCode === 'string'
    ) {
      this.refreshAd();
    }
  }

  attachAdsEvent = () => {
    //const { data: { adCode } = {} } = this.props;
    const { data = {} } = this.props;
    const { adCode } = data;
    window.addEventListener('adSlotDefined', e => {
      if (
        e &&
        e.detail &&
        e.detail.adCodeObj &&
        typeof e.detail.adCodeObj === 'object' &&
        typeof e.detail.adCode === 'string' &&
        typeof adCode === 'string' &&
        adCode.toLowerCase() === e.detail.adCode.toLowerCase()
        //data.divId === e.detail.divId &&
      ) {
        this.adData = {
          adCode: e.detail.adCode,
          adCodeObj: e.detail.adCodeObj,
          divId: e.detail.divId,
        };
      }
    });
  };

  refreshAd = () => {
    this.setState({
      refreshInitDone: true,
    });
    this.refreshIntervalRef = setInterval(() => {
      window.googletag.pubads().refresh([this.adData.adCodeObj]);
    }, this.props.data.refreshV2);
  };

  render() {
    if (this.props.pauseAdCall) {
      return false;
    }
    const { props } = this;
    const path =
      (this.props.navigation &&
        this.props.navigation.data &&
        this.props.navigation.data.path) ||
      '';
    let { data } = this.props;
    if (this.state.reloadAd) {
      const reloadAd = {
        adCode: data.reload.adCode,
        size: data.reload.size,
        divId: data.reload.divId,
      };
      data = { ...data, ...reloadAd };
    }
    const {
      // data,
      lazyload,
      isPrime,
      hyp1,
      isCTN,
      refreshAd,
      cookieKey,
      targetingInfo,
      prebidFlag,
      prebidCountryList,
      dfpParams,
      // currentCountry,
    } = this.props;
    let prebid = false;
    let currentCountry = '';
    let excludePrebid = false;
    if (data && data.prebid && data.prebid === 'false') {
      excludePrebid = true; //read prebid param from the feed
    }

    if (!isPrime && typeof data !== 'undefined') {
      if (typeof window !== 'undefined' && typeof window.apstag === 'object') {
        currentCountry = Cookie.get('geo_country');
        if (
          prebidFlag &&
          !excludePrebid &&
          typeof prebidCountryList === 'object' &&
          (prebidCountryList.length === 0 ||
            prebidCountryList.indexOf(currentCountry) !== -1)
        ) {
          prebid = true;
        }
      }

      if (
        prebid &&
        typeof window !== 'undefined' &&
        !window.PRBID_INITIALISED &&
        typeof window.apstag === 'object'
      ) {
        // initialize apstag with global settings
        window.apstag.init({
          pubID: '5025',
          adServer: 'googletag',
          bidTimeout: 2000,
          simplerGPT: true,
          params: {
            us_privacy: '1---', // refer privacy string components under IAB’s U.S. Privacy String
          },
        });

        window.PRBID_INITIALISED = true;
      }

      // console.log(data.adCode);

      // if (
      //   prebid &&
      //   data &&
      //   typeof data.adCode === 'string' &&
      //   data.adCode.match(/Andbeyond/gi)
      // ) {
      //   return null;
      // }
      if (isCTN && !lazyload && !data.dfpslot) {
        return <CtnAdDiv {...props} data={{ ...data }} />;
      }
      if (isCTN && !lazyload && data.dfpslot) {
        return <CtnDfpAdDiv {...props} data={{ ...data }} />;
      }
      if (lazyload) {
        return (
          <LazyLoad
            className={props.lazyClassName}
            debounce={false}
            offsetVertical={this.props.offsetVertical || 400}
            onContentVisible={() => {
              this.props.loadAllAdsFromQueue('', path);
            }}
          >
            <AdDiv
              {...props}
              data={{ ...data, hyp1, cookieKey, ...targetingInfo }}
              prebid={prebid}
              dfpParams={dfpParams}
            />
          </LazyLoad>
        );
      }
      if (
        this.props.inlineGptAd &&
        data &&
        data.divId &&
        !this.props.adsCounter
      ) {
        //@todo here setTargeting is not happening properly here
        return (
          <React.Fragment>
            <div
              id={data.divId}
              className={props.className}
              suppressHydrationWarning
            />
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `
              (function(){
                var divId = '${data.divId}';
                var adSlotName = '${data.adCode}'
                var adSize = ${JSON.stringify(data.size)};
                window.adQueue = window.adQueue || [];
                window.adQueue.push(divId);
                window.googletag = window.googletag || { cmd: [] };
                window.googletag.cmd.push(function() {
                  window.TimesGDPR.common.consentModule.gdprCallback(dataObj => {
                    if (dataObj.isEUuser && dataObj.didUserOptOut === false ) {
                      //user has has given consent for personalised ads ( i.e did not opt out )
                      window.googletag && googletag.pubads().setRequestNonPersonalizedAds(0);
                    }else if(dataObj.isEUuser){
                      window.googletag.pubads().setRequestNonPersonalizedAds(1);
                    }
                  });
                  var googletag = window.googletag;
                  var adObject = googletag.defineSlot(adSlotName, adSize, divId);
                  adObject.addService(googletag.pubads());
                  //googletag.display(divId);
                });
              })();
              `,
              }}
            />
          </React.Fragment>
        );
      }
      return (
        <AdDiv
          {...props}
          data={{ ...data, hyp1, refreshAd, cookieKey, ...targetingInfo }}
          deviceType={this.props.deviceType}
          prebid={prebid}
        />
      );
    }
    return null;
  }
}
const mapStateToProps = state => ({
  isPrime: state.isPrime,
  navigation: state.navigation,
  hyp1: state.liveblog ? state.liveblog.hyp1 : '',
  adsCounter: _get(state, 'adCaller.adsCounter'),
  currentCountry: state.geo ? state.geo.currentCountry : '',
  prebidFlag: !!(state.adCaller && state.adCaller.prebidFlag),
  adsQueueData: state.adCaller.adsQueueData,
  prebidCountryList:
    state.adCaller &&
    state.adCaller.prebidCountryList &&
    state.adCaller.prebidCountryList.length > 0
      ? state.adCaller.prebidCountryList
      : [],
});

const mapDispatchToProps = dispatch => ({
  addToQueue: params => {
    dispatch(addToQueue(params));
  },
  loadAllAdsFromQueue: (params, path) => {
    dispatch(loadAllAdsFromQueue(params, path));
  },
  setGutterFallback: (showGutterFallback, gutterFallbackAdObject) => {
    dispatch(setGutterFallback(showGutterFallback, gutterFallbackAdObject));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdCaller);
