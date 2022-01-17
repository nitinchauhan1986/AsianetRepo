import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import Image from 'components/Image';
import AdCaller from 'helpers/ads/adCaller';
import WithDelay from 'helpers/hoc/WithDelay';
import Cookie from 'utils/cookies';
import s from './Footer.scss';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showunderToneAd: false,
    };
  }
  componentDidMount() {
    window.times = window.times || {};
    window.times.cookie = window.times.cookie || {};
    window.times.cookie.set = window.times.cookie.set || Cookie.set;

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
      if (
        window.geoinfo.CountryCode === 'US' ||
        window.geoinfo.CountryCode === 'CA'
      ) {
        this.setState({
          showunderToneAd: true,
        });
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

  renderSection = secData => {
    const columnData = [];
    const secLabelForGA = secData.label ? secData.label : 'TOI';
    if (secData && secData.items && secData.items.length > 0) {
      secData.items.forEach(col => {
        columnData.push(
          <Link
            to={col.eulink && this.props.isPrivateUser ? col.eulink : col.wu}
            key={col.wu}
            className={col.cls}
            data-newga={`Footer_Actions#${secLabelForGA}-${col.hl}`}
          >
            {col.hl}
          </Link>,
        );
      });
      return (
        <div className={`${s.section}`} key={secData.label}>
          {secData.label ? (
            <h2 className={s.section_heading}>{secData.label}</h2>
          ) : null}
          <div className={s.section_items}>{columnData}</div>
        </div>
      );
    }
    return null;
  };

  renderIcons = icons => {
    const iconData = [];
    if (icons && icons.items && icons.items.length > 0) {
      icons.items.forEach(icon => {
        iconData.push(
          <Link
            className={`${s.footer_icon} ${icon.type}`}
            to={icon.wu}
            title={icon.hl}
            data-newga={`Footer_Actions#SocialMedia-${icon.hl}`}
            key={icon.hl}
          />,
        );
      });
      return (
        <div className={s.social_wrapper}>
          {icons.label ? (
            <h2 className={s.section_heading}>{icons.label}</h2>
          ) : null}
          <div className={s.social_icons}>{iconData}</div>
        </div>
      );
    }
    return null;
  };
  // componentDidMount() {
  //   this.props.loadFooterData();
  // }
  render() {
    const { footerData } = this.props;
    if (footerData) {
      const sections = [];
      if (footerData.sections && footerData.sections.length > 0) {
        footerData.sections.forEach(sec => {
          sections.push(this.renderSection(sec));
        });
      }

      return (
        <div className={`${s.footer_container} footer_wrapper contentwrapper `}>
          <div className="contentwrapper">
            <div className={s.footer_section}>
              <div className={`${s.footer_left_col}`}>
                {footerData.logo ? (
                  <Link
                    className={s.toilogo}
                    to={footerData.logo.link}
                    data-newga="Footer_Actions#TOI-logo"
                  >
                    <Image
                      src="https://static.toiimg.com/photo/71215965.cms"
                      alt="logo"
                      lazyload
                    />
                  </Link>
                ) : null}
                {footerData.siteLinks
                  ? this.renderSection(footerData.siteLinks)
                  : null}
                {footerData.social ? this.renderIcons(footerData.social) : null}
                {footerData.otherTimesSite
                  ? this.renderSection(footerData.otherTimesSite)
                  : null}
              </div>
              <div className={`${s.footer_right_col}`}>{sections}</div>
            </div>
            {footerData.disclaimer ? (
              <div className={s.disclaimer}>{footerData.disclaimer}</div>
            ) : null}
          </div>
          {footerData.andBeyond && (
            <WithDelay delay={15000}>
              <AdCaller
                data={footerData.andBeyond}
                deviceType="all"
                immediateLoad
                // className={s.fbn_ad}
              />
            </WithDelay>
          )}
          {footerData.underTone &&
            this.state.showunderToneAd && (
              <WithDelay delay={3000}>
                <AdCaller
                  immediateLoad
                  data={footerData.underTone}
                  deviceType="all"
                />
              </WithDelay>
            )}
        </div>
      );
    }

    return null;
  }
}

Footer.propTypes = {
  footerData: PropTypes.shape({}).isRequired,
  isPrivateUser: PropTypes.bool.isRequired,
};

export default Footer;
