import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ErrorBoundary from 'components/ErrorBoundary';
import _get from 'lodash.get';
import { checkGeoHandling } from 'helpers/ads/utils';
import { loadNativeCampaign } from 'helpers/ads/redux';

const CAMPAIGN_TYPE = {
  BO: 'boplusplus',
  MREC: 'mrecplusplus',
};

const LazyBoPlusPlus = React.lazy(() =>
  import('../../components_v2/mobile/NativeCampaign/BoPlusPlus'),
);
const LazyMrecPlusPlus = React.lazy(() =>
  import('../../components_v2/mobile/NativeCampaign/MrecPlusPlus'),
);

const pathNotInExcludeList = pagePath =>
  !(pagePath.includes('/business/') || pagePath.includes('/spotlight/'));
class WithNativeCampaign extends React.PureComponent {
  static reqSent;
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { isPrime } = this.props;
    if (!isPrime) {
      if (!WithNativeCampaign.reqSent) {
        WithNativeCampaign.reqSent = true;
        checkGeoHandling(this.checkInnovation);
      }
      setTimeout(() => {
        this.setState({
          clientSide: true,
        });
      }, 0);
    }
  }

  checkInnovation = (geoinfo = {}) => {
    this.props.loadNativeCampaign(geoinfo.userCountry);
  };

  render() {
    const {
      nativeCampaign,
      type,
      children,
      pagePath,
      isPrime,
      isMobile,
      placeholderClassName,
      ...restProps
    } = this.props;
    const { clientSide } = this.state;

    let myLazyComponent = null;
    let retComp = null;
    let suspenseFallback = null;
    let nativeCampaignBlk = null;

    if (type === CAMPAIGN_TYPE.MREC) {
      nativeCampaignBlk = (
        <div className={`nativeCampaignBlk ${placeholderClassName}`} />
      );
    }
    if (!isPrime) {
      if (nativeCampaign && clientSide) {
        const nativeAds = _get(nativeCampaign, 'data.nativeAds');
        const pathInUrl = pagePath || window.location.pathname;
        if (
          isMobile &&
          type === CAMPAIGN_TYPE.MREC &&
          nativeAds &&
          nativeAds.nativeMREC &&
          pathNotInExcludeList(pathInUrl)
        ) {
          suspenseFallback = nativeCampaignBlk;
          myLazyComponent = (
            <LazyMrecPlusPlus
              nativeAds={nativeAds}
              pagePath={pathInUrl}
              mrecPlaceholderClassName={placeholderClassName}
              {...restProps}
            />
          );
        } else if (
          isMobile &&
          type === CAMPAIGN_TYPE.BO &&
          nativeAds &&
          nativeAds.nativeBO &&
          pathNotInExcludeList(pathInUrl)
        ) {
          myLazyComponent = (
            <LazyBoPlusPlus
              nativeAds={nativeAds}
              pagePath={pathInUrl}
              {...restProps}
            />
          );
        }
        if (myLazyComponent) {
          retComp = (
            <ErrorBoundary>
              <Suspense fallback={suspenseFallback}>{myLazyComponent}</Suspense>
            </ErrorBoundary>
          );
        } else if (React.isValidElement(children)) {
          retComp = children;
        }
      } else if (type === CAMPAIGN_TYPE.MREC) {
        retComp = nativeCampaignBlk;
      }
    }
    return retComp;
  }
}
const mapStateToProps = state => ({
  isPrime: state.isPrime,
  isMobile: state.isMobile,
  frmapp: state.isFrmapp,
  nativeCampaign: _get(state, 'adCaller.nativeCampaign', null),
  pagePath: _get(state, 'adCaller.pagePath'),
});

const mapDispatchToProps = dispatch => ({
  loadNativeCampaign: params => {
    dispatch(loadNativeCampaign(params));
  },
});

WithNativeCampaign.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string.isRequired,
  nativeCampaign: PropTypes.shape({}),
  loadNativeCampaign: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  isPrime: PropTypes.bool,
  pagePath: PropTypes.string,
  placeholderClassName: PropTypes.string,
};
WithNativeCampaign.defaultProps = {
  children: null,
  nativeCampaign: null,
  isMobile: false,
  isPrime: false,
  pagePath: null,
  placeholderClassName: '',
};
export default connect(mapStateToProps, mapDispatchToProps)(WithNativeCampaign);
