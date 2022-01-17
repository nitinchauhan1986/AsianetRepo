import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import AdCaller from 'helpers/ads/adCaller';
import WithDelay from 'helpers/hoc/WithDelay';
import WithNativeCampaign from 'helpers/ads/WithNativeCampaign';
// import { getFbnFanAdCode } from 'helpers/ads/utils';
import StickyDiv from 'components/StickyDiv';
import smoothScroll from 'smoothscroll';
import { sendGaThroughProps } from 'helpers/analytics/sendGaThroughProps';
import { gaWrapper } from 'helpers/analytics';
import s from './Footer.scss';

// eslint-disable-next-line react/prop-types
const RenderSection = ({ secData, isPrivateUser }) => {
  const gaAction = 'Footer_Actions';
  const label =
    typeof secData.label === 'string'
      ? `Under${secData.label.split(' ').join('')}-`
      : 'UnderTOI-';
  if (secData && secData.items instanceof Array && secData.items.length > 0) {
    return (
      <div className={s.section} key={secData.label}>
        {secData.label ? (
          <h2 className={`${s.section_heading}`}>{secData.label}</h2>
        ) : null}
        <div className={`${s.section_items}`}>
          {secData.items.map(col => (
            <Link
              to={col.eulink && isPrivateUser ? col.eulink : col.wu}
              key={col.wu}
              className={col.cls}
              data={{
                gaAction,
                gaLabel: `${label}${col.hl}`,
              }}
            >
              {col.hl}
            </Link>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

class Footer extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.triggerGa = true;
  }

  componentDidMount() {
    if (
      window &&
      window.geoinfo &&
      (typeof window.geoinfo.CountryCode === 'string' ||
        typeof window.geoinfo.region_code === 'string')
    ) {
      if (
        window.geoinfo.CountryCode === 'US' &&
        window.geoinfo.region_code === 'CA'
      ) {
        this.addAdditionalLinks();
      }
    }
  }

  addAdditionalLinks = () => {
    if (
      this.props.footerData?.siteLinks &&
      this.props.footerData?.siteLinks?.items?.length
    )
      this.props.footerData.siteLinks.items.push(
        {
          wu: 'https://timesofindia.indiatimes.com/donotsell.cms',
          hl: 'Do Not Sell Data',
        },
        {
          wu: 'https://timesofindia.indiatimes.com/cookie-policy',
          hl: 'Cookie Policy',
        },
      );
  };

  handleGAOnScroll = state => {
    if (this.triggerGa && state.sticky) {
      gaWrapper('send', 'event', 'move_to_top', 'seen', window.location.href, {
        nonInteraction: 1,
      });
      this.triggerGa = false;
    }
  };

  getRefreshTime() {
    const { adRefreshRate } = this.props;
    return adRefreshRate && adRefreshRate > 0
      ? adRefreshRate
      : this.defaultAdRefreshInterval;
  }

  backtoTopClick = () => {
    const data = {
      gaAction: 'click',
      gaLabel: window.location.href,
      gaCategory: 'move_to_top',
    };
    sendGaThroughProps({
      data,
    });
    smoothScroll(0, 1000);
  };

  getBOComponent = () => {
    let retComp = null;
    const { hideAds, hideFbn, fbnAdCodeObject } = this.props;
    if (!hideAds && !hideFbn && typeof fbnAdCodeObject === 'object') {
      const adComp = (
        <AdCaller
          data={fbnAdCodeObject}
          deviceType="mobile"
          className={s.fbn_ad}
          immediateLoad
        />
      );
      retComp = (
        <WithNativeCampaign type="boplusplus">{adComp}</WithNativeCampaign>
      );
    }
    return retComp;
  };

  render() {
    const {
      footerData = {},
      frmapp,
      footerWithOnlyFbn,
      hideBackToTop,
      hideFbn,
      hideAds,
    } = this.props;
    if (footerData) {
      if (!hideAds && !hideFbn && (frmapp || footerWithOnlyFbn)) {
        return (
          <div className={s.fbn_ad_container}>{this.getBOComponent()}</div>
        );
      }
      if (hideAds && !hideFbn && frmapp) {
        return null;
      }

      return (
        <footer className={`${s.footer_container}`}>
          {/* <div className={s.heading}>
            The Times of India / <b>Top News</b>
          </div> */}
          <div
            className={`${this.props.useContentVisibilty &&
              s.footer_intrinsic_size}`}
          >
            <div className={`${s.footer_sitelinks}`}>
              {footerData.logo ? (
                <Link
                  className={s.logo}
                  to={footerData.logo.link}
                  title="TOI"
                />
              ) : null}
              {footerData.siteLinks && (
                <RenderSection
                  secData={footerData.siteLinks}
                  isPrivateUser={this.props.isPrivateUser}
                />
              )}
            </div>
            {!hideBackToTop && (
              <StickyDiv
                stickyClass={s.sticky}
                outerContainerClass={s.tabNavWrapper}
                offsetFromTop={0}
                aboveFooter
                stickyFromTopStaticHeight={1000}
                callbackProvided={this.handleGAOnScroll}
              >
                <button
                  type="button"
                  aria-label="back to top"
                  className={`${s.backtotop} podcastBackButton`}
                  onClick={this.backtoTopClick}
                />
              </StickyDiv>
            )}

            {footerData.sections instanceof Array &&
              footerData.sections.map(item => (
                <RenderSection
                  secData={item}
                  isPrivateUser={this.props.isPrivateUser}
                  key={item.label}
                />
              ))}
            {footerData.disclaimer ? (
              <div className={s.disclaimer}>{footerData.disclaimer}</div>
            ) : null}
          </div>
          {this.getBOComponent()}
          {footerData.andBeyond && (
            <WithDelay delay={15000}>
              <AdCaller
                data={footerData.andBeyond}
                deviceType="mobile"
                immediateLoad
                // className={s.fbn_ad}
              />
            </WithDelay>
          )}
        </footer>
      );
    }

    return null;
  }
}

Footer.propTypes = {
  footerData: PropTypes.shape({}).isRequired,
  fbnAdCodeObject: PropTypes.shape({}),
  frmapp: PropTypes.bool,
  footerWithOnlyFbn: PropTypes.bool,
  params: PropTypes.shape({
    fullPath: PropTypes.string,
  }).isRequired,
  refreshFbnAdsData: PropTypes.shape({}),
  appAdCode: PropTypes.shape({}),
  fbnAdsData: PropTypes.shape({}),
  adRefreshRate: PropTypes.number,
  hideBackToTop: PropTypes.bool,
  hideFbn: PropTypes.bool,
  hideAds: PropTypes.bool,
  isPrivateUser: PropTypes.bool.isRequired,
  useContentVisibilty: PropTypes.bool,
  nativeCampaignData: PropTypes.shape({}).isRequired,
};
Footer.defaultProps = {
  fbnAdCodeObject: undefined,
  frmapp: false,
  footerWithOnlyFbn: false,
  refreshFbnAdsData: undefined,
  appAdCode: undefined,
  fbnAdsData: undefined,
  adRefreshRate: 0,
  hideBackToTop: false,
  hideFbn: false,
  hideAds: false,
  useContentVisibilty: false,
};

export default Footer;
