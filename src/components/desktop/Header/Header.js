import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { inViewForReact } from 'utils/common';
import TopBar from './TopBar/TopBar';
import Navigation from './Navigation/Navigation';
import Masthead from './Masthead/Masthead';
import NavList from '../../common/NavList/NavList';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      stickyHeader: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.monitorScroll());
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.monitorScroll());
  }

  monitorScroll = () => throttle(this.handleScrollEvent, 100);

  handleScrollEvent = () => {
    let stickyHeader = false;
    const elem =
      document.getElementById('header-masthead') ||
      document.getElementById('top-bar-container');

    if (elem && !inViewForReact(elem, 0, true)) {
      stickyHeader = true;
    }
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton && stickyHeader) {
      refreshButton.classList.add('sticky');
    } else if (refreshButton && !stickyHeader) {
      refreshButton.classList.remove('sticky');
    }
    window.isStickyHeader = stickyHeader;
    this.setState({ stickyHeader });
  };

  render() {
    const {
      headerData = {},
      hideCyclicNav,
      showWeatherInC,
      enablePrimeFlow,
      isPrime,
      killSwitchStatus,
      hideLogoMastHead,
      showToiPlusEntryPoints,
    } = this.props;
    const {
      navigation,
      masthead,
      videomasthead,
      hideTimeStamp,
      promotionalL2,
    } = headerData;
    const isMastheadToiLogo = masthead && masthead.type === 'toiLogo';
    const theme = headerData.colorTheme || this.props.colorTheme;
    return (
      <div className="header-container contentwrapper">
        {}
        <TopBar
          isWapView={this.props.isWapView}
          hideTimeStamp={hideTimeStamp}
          editionSwitch={this.props.headerData?.editionSwitch}
          hideTimesPointPopup={this.props.hideTimesPointPopup}
          isPrime={isPrime}
          colorTheme={theme}
          showWeatherInC={showWeatherInC}
          enablePrimeFlow={enablePrimeFlow}
          pageType={this.props.pageType}
          showToiPlusEntryPoints={showToiPlusEntryPoints}
        />
        {(masthead || videomasthead) && (
          <Masthead
            config={masthead}
            videomasthead={isPrime ? {} : videomasthead}
            colorTheme={theme}
            earplugAdsRight={headerData.earPlugAdsRight}
            earplugAdsLeft={headerData.earPlugAdsLeft}
            leaderboard={headerData.leaderboard}
            poweredBy={headerData.poweredBy}
            hideLogoMastHead={hideLogoMastHead}
          />
        )}
        <Navigation
          hideCyclicNav={hideCyclicNav}
          l2navigationChild={this.props.l2navigationChild}
          allMenu={headerData.allMenu}
          colorTheme={theme}
          navigationData={navigation}
          isWapView={this.props.isWapView}
          stickyHeader={this.state.stickyHeader}
          showHomeOnlyWhenSticky={isMastheadToiLogo}
          pageType={this.props.pageType}
          killSwitchStatus={killSwitchStatus}
          geolocation={this.props.geolocation}
          showToiPlusEntryPoints={showToiPlusEntryPoints}
        />
        {promotionalL2 && (
          <div className="contentwrapper">
            <NavList data={promotionalL2} />
          </div>
        )}
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   navigationData: state.header.data,
// });

Header.propTypes = {
  hideCyclicNav: PropTypes.bool,
  l2navigationChild: PropTypes.shape({}),
  promotionalL2: PropTypes.shape({}),
  headerData: PropTypes.shape({
    editionSwitch: PropTypes.shape({}),
  }).isRequired,
  isWapView: PropTypes.bool.isRequired,
  hideTimesPointPopup: PropTypes.bool,
  showWeatherInC: PropTypes.bool,
  enablePrimeFlow: PropTypes.bool,
  pageType: PropTypes.string,
  killSwitchStatus: PropTypes.objectOf({}),
  geolocation: PropTypes.string,
  showToiPlusEntryPoints: PropTypes.bool,
  hideLogoMastHead: PropTypes.bool,
  colorTheme: PropTypes.string,
};

Header.defaultProps = {
  hideCyclicNav: false,
  l2navigationChild: null,
  hideTimesPointPopup: false,
  promotionalL2: { items: [] },
  showWeatherInC: false,
  enablePrimeFlow: false,
  pageType: '',
  killSwitchStatus: null,
  geolocation: '1',
  showToiPlusEntryPoints: false,
  hideLogoMastHead: false,
  colorTheme: '',
};

export default Header;
