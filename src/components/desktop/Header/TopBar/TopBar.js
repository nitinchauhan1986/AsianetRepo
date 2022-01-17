import React from 'react';
// Moment library size is very high 100kb zipped and minified

import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { TOI_PLUS_PLAN_PAGE_URL } from 'constants/index';
// import Login from 'components/Login';
// import ErrorBoundary from 'components/ErrorBoundary';
import WithGeo from 'helpers/ads/WithGeo';
// import WithTimesPoint from 'modules/WithTimesPoint';
// import WithTimesPointModal from 'modules/WithTimesPointModal';
// import WithNotificationCenter from 'modules/WithNotificationCenter';
// import WithWeather from 'modules/WithWeather';
// import { toiSubscriptionflowStartEmitter } from 'components/EventEmitters';
import { gaWrapper } from 'helpers/analytics';
import EditionSwitch from 'components_v2/common/EditonSwitch';
import ElementInView from 'components_v2/common/ElementInView/ElementInView';
import s from './TopBar.scss';
import WithSocials from '../Socials/WithSocials';

class TopBar extends React.Component {
  // static propTypes = {
  //   data: PropTypes.shape({}).isRequired,
  // };

  curDate = new Date();
  handleSubscribeNowCTA = screenType => {
    toiSubscriptionflowStartEmitter({
      screenType,
    });
    gaWrapper(
      'send',
      'event',
      window.categoryForGA,
      `NavBar-Header`,
      'Header-NewTOIPlusCTA-Click',
    );
  };

  render() {
    const {
      hideTimeStamp,
      colorTheme,
      isPrime,
      showToiPlusEntryPoints,
      pageType,
    } = this.props;

    const theme = colorTheme ? s[colorTheme] : '';
    let dateString;

    if (!hideTimeStamp) {
      dateString = format(
        this.curDate,
        'ddd, MMM DD, YYYY | [Updated] hh.mmA [IST]',
      );
    }

    return (
      <div
        id="top-bar-container"
        className={`${s['top-area']} ${theme} top-area `}
      >
        <div className="contentwrapper">
          <div className={`${s.row} rel`}>
            <div className={s.column}>
              {pageType === 'toiplusplanpage' && (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href="/toi-plus"
                  className={s.toiLogo}
                  aria-label="toi-plus"
                />
              )}
              {this.props.editionSwitch && (
                <div className={s.leftColChild}>
                  <EditionSwitch
                    editionSwitch={this.props.editionSwitch}
                    colorTheme={colorTheme}
                  />
                </div>
              )}
              {dateString && (
                <div className={`${s['date-time']} ${s.leftColChild}`}>
                  {dateString}
                </div>
              )}
              {/* <div className={s.leftColChild}>
                <WithWeather
                  isWapView={this.props.isWapView}
                  isWeatherInC={this.props.showWeatherInC}
                  colorTheme={colorTheme}
                />
              </div> */}
            </div>
            <div className={s.column}>
              {/* <WithTimesPoint isWapView={false} /> */}
              {typeof window !== 'undefined' &&
                typeof window.geoinfo !== 'undefined' &&
                (window.geoinfo.CountryCode === 'IN' ||
                  showToiPlusEntryPoints) &&
                !isPrime &&
                pageType !== 'toiplusplanpage' && (
                  <ElementInView
                    gaAction="NavBar-Header"
                    gaLabel="Header-NewTOIPlusCTA-View"
                    className={s.toiplusButtonWrapper}
                  >
                    <a
                      type="button"
                      className={s.toiplusButton}
                      href={TOI_PLUS_PLAN_PAGE_URL}
                      onClick={() => this.handleSubscribeNowCTA('planScreen')}
                    >
                      SUBSCRIBE TO TOI+
                    </a>
                  </ElementInView>
                )}

              {/* <WithNotificationCenter theme="home" colorTheme={colorTheme} /> */}
              <WithSocials colorTheme={colorTheme} />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

TopBar.propTypes = {
  hideTimeStamp: PropTypes.bool,
  query: PropTypes.shape({}),
  isWapView: PropTypes.bool,
  editionSwitch: PropTypes.shape({}),
  hideTimesPointPopup: PropTypes.bool,
  colorTheme: PropTypes.string,
  showWeatherInC: PropTypes.bool,
  pageType: PropTypes.string,
  showToiPlusEntryPoints: PropTypes.bool,
};
TopBar.defaultProps = {
  hideTimeStamp: false,
  query: {},
  isWapView: false,
  editionSwitch: undefined,
  hideTimesPointPopup: false,
  colorTheme: '',
  showWeatherInC: false,
  pageType: '',
  showToiPlusEntryPoints: false,
};

export default TopBar;
