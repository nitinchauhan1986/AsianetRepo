import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash.get';
import Link from 'components/Link';
import Image from 'components/Image';
import { checkGeoHandling } from 'helpers/ads/utils';
import AdCaller from 'helpers/ads/adCaller';
import s from './Masthead.scss';

/**
 * Masthead Component for the Desktop Website
 * This will be have the provision to handle the masthead innovation as well.
 * In site_settings.cms need the URL for the <image> to be served and innovation boolean flag.
 */
class Masthead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showleaderboard: false,
      config: this.props.config,
      showleftearplugAd: false,
      showrightearplugAd: false,
    };
  }
  componentDidMount() {
    checkGeoHandling(this.isEarPlugVisible);
    const { leaderboard } = this.props;
    if (
      window &&
      window.geoinfo &&
      typeof window.geoinfo.CountryCode === 'string'
    ) {
      if (
        leaderboard &&
        leaderboard.disallowedcounteries &&
        leaderboard.disallowedcounteries.indexOf(window.geoinfo.CountryCode) < 0
      ) {
        this.setState({ showleaderboard: true });
      }
    }
    this.checkAndUpdateMastheadFrame();
  }
  isEarPlugVisible = geoinfo => {
    const { earplugAdsLeft, earplugAdsRight } = this.props;
    let { showleftearplugAd, showrightearplugAd } = this.state;
    if (geoinfo && geoinfo.userCountry) {
      if (
        earplugAdsLeft &&
        earplugAdsLeft.allowedcounteries &&
        earplugAdsLeft.allowedcounteries.indexOf(geoinfo.userCountry) >= 0
      ) {
        showleftearplugAd = true;
      }
      if (
        earplugAdsRight &&
        earplugAdsRight.allowedcounteries &&
        earplugAdsRight.allowedcounteries.indexOf(geoinfo.userCountry) >= 0
      ) {
        showrightearplugAd = true;
      }
      if (showleftearplugAd || showrightearplugAd) {
        this.setState({
          showleftearplugAd,
          showrightearplugAd,
        });
      }
    }
  };
  checkAndUpdateMastheadFrame = () => {
    const { config } = this.state;
    const { hideLogoMastHead } = this.props;
    if (!hideLogoMastHead && config.timeout > 0) {
      let newobj = {};
      if (config.settledFrame && _get(config, 'settledFrame.data.src')) {
        newobj = config.settledFrame;
      }
      setTimeout(() => {
        this.setState(
          {
            config: newobj,
          },
          this.checkAndUpdateMastheadFrame,
        );
      }, config.timeout);
    }
  };

  render() {
    const {
      colorTheme = '',
      earplugAdsLeft,
      earplugAdsRight,
      videomasthead,
      leaderboard,
      poweredBy,
      hideLogoMastHead,
    } = this.props; //default value to be '' as this is going to be assigned later on
    const { type, data } = this.state.config;
    let { link, innovation } = this.state.config;
    if (hideLogoMastHead) {
      innovation = false;
      link = '';
    }
    const src =
      (innovation && data && _get(data, 'src', undefined)) ||
      `https://static.toiimg.com/photo/${
        colorTheme ? '79638690' : '73729958'
      }.cms`;

    // old toi logo : 77144633
    const theme = s[colorTheme] || colorTheme;

    if (videomasthead && videomasthead.adCode) {
      return (
        <div
          id="header-masthead"
          className={`${s.masthead} ${theme} ${s[type] || ''}`} //type === 'toiLogo' ? s.toiLogo : ''
        >
          <div className="contentwrapper">
            <AdCaller data={videomasthead} className={s.videomasthead} />
          </div>
        </div>
      );
    }

    if (this.state.showleaderboard) {
      return (
        <div
          id="header-masthead"
          className={`${s.masthead} ${theme}`} //type === 'toiLogo' ? s.toiLogo : ''
        >
          <div className="contentwrapper">
            <div className={s.mastheadAds}>
              <div className={s.left}>
                {type === 'toiLogo' && (
                  <>
                    <Link to={link || '/'}>
                      <img
                        src="https://static.toiimg.com/photo/77144633.cms"
                        alt=""
                      />
                    </Link>
                  </>
                )}
              </div>
              <AdCaller data={leaderboard} className={s.right} />
            </div>
          </div>
        </div>
      );
    }

    let linkAttr = {};
    if (innovation && link) {
      linkAttr = {
        target: '_blank',
      };
    }
    return (
      <div
        id="header-masthead"
        className={`${s.masthead} ${theme} ${s[type] || ''}`} //type === 'toiLogo' ? s.toiLogo : ''
      >
        <div className="contentwrapper">
          {earplugAdsLeft &&
            this.state.showleftearplugAd &&
            earplugAdsLeft.adCode && (
              <AdCaller data={earplugAdsLeft} className={s.earplugLeft} />
            )}
          {type === 'toiLogo' && (
            <>
              <Link to={link || '/'} {...linkAttr}>
                <Image src={src} />
              </Link>
            </>
          )}
          {poweredBy && <div className={s.poweredby}>{poweredBy}</div>}
          {earplugAdsRight &&
            this.state.showrightearplugAd &&
            earplugAdsRight.adCode && (
              <AdCaller data={earplugAdsRight} className={s.earplugRight} />
            )}
        </div>
      </div>
    );
  }
}

Masthead.propTypes = {
  config: PropTypes.shape({
    innovation: PropTypes.bool,
    type: PropTypes.string,
    link: PropTypes.string,
    colorTheme: PropTypes.string,
    data: PropTypes.shape({}),
  }).isRequired,
  videomasthead: PropTypes.shape({}),
  colorTheme: PropTypes.string,
  poweredBy: PropTypes.string,
  leaderboard: PropTypes.shape({}),
  earplugAdsRight: PropTypes.shape({
    adCode: PropTypes.string,
    allowedcounteries: PropTypes.arrayOf(PropTypes.string),
  }),
  earplugAdsLeft: PropTypes.shape({
    adCode: PropTypes.string,
    allowedcounteries: PropTypes.arrayOf(PropTypes.string),
  }),
  hideLogoMastHead: PropTypes.bool,
};

Masthead.defaultProps = {
  colorTheme: '',
  videomasthead: undefined,
  earplugAdsRight: undefined,
  earplugAdsLeft: undefined,
  leaderboard: undefined,
  poweredBy: '',
  hideLogoMastHead: false,
};

export default Masthead;
