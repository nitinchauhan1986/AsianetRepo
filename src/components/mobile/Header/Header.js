import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import StickyDiv from 'components/StickyDiv';
import Link from 'components/Link';
//import Image from 'components/Image';
import { sendGaThroughProps } from 'helpers/analytics/sendGaThroughProps';
import {
  debounce,
  inViewForReact,
  checkAndRedirectToHomePage,
  isPrimeUser,
} from 'utils/common';
import { getGeoCountry } from 'utils/primeUtil';
import OnetapsigninV2 from 'components/Login/OnetapsigninV2';
//import Link from '../Link';
// import Navigation from '../Navigation';
//import TopBar from './TopBar/TopBar';
import OpenInAppTopWidget from 'components_v2/mobile/OpenInAppTopWidget';
import AddOrgSchema from 'components_v2/common/AddOrgSchema';
import Login from 'components/Login';
import WithTimesPoint from 'modules/WithTimesPoint';
import Menu from 'components_v2/mobile/Menu';
import AdCaller from 'helpers/ads/adCaller';
import WithGeo from 'helpers/ads/WithGeo';
import OpenInAppBtn from 'components_v2/mobile/OpenInAppBtn';
import { gaWrapper } from 'helpers/analytics';
import ListingHeader from './ListingHeader';
import s from './Header.scss';
import { TIMESCLUB_CTA_NAV } from '../../../constants';
//import MasterKillSwitch from '../../../components/ToiSubscription/utils/masterKillSwitch';

class Header extends React.Component {
  constructor(props) {
    super();
    this.state = {
      openInAppStickyVisible: false,
      openMenu: false,
      isFixedHeader: false,
      isHeaderInView: true,
      masthead: props.headerData && props.headerData.masthead,
    };
    this.prvPos = 0;
    this.debouncedHandleScroll = debounce(this.handleScroll.bind(this), 10);
    this.openInAppToggled = this.openInAppToggled.bind(this);
    this.isPrimeUser = false;
    this.defaultL1 = [
      { name: 'Top', path: '/', isTop: true, gaLabel: '' },
      { name: 'Briefs', path: '/briefs', gaLabel: '' },
      {
        name: 'TOI+',
        path: '/toi-plus',
        gaLabel: 'toiplus',
        styles: 'toiplus',
      },
      {
        name: 'Coronavirus',
        path: 'https://m.timesofindia.com/coronavirus',
        gaLabel: 'corona',
      },
      { name: 'Videos', path: '/videos', gaLabel: '' },
      { name: 'City', path: '/city', gaLabel: '' },
    ];
  }
  openInAppToggled({ visible }) {
    this.setState({ openInAppStickyVisible: visible });
  }
  handleScroll() {
    let { isFixedHeader } = this.state;
    const elem = document.querySelector(`header.${s.mobile}`);
    const isHeaderInView = !!(elem && inViewForReact(elem, 0, true, true));
    const position = document.body.getBoundingClientRect();
    if (position.top === 0) {
      isFixedHeader = false;
    } else if (position.top >= this.prvPos) {
      isFixedHeader = true; //up scroll
    } else {
      isFixedHeader = false; //down scroll
    }

    if (
      this.state.isHeaderInView !== isHeaderInView ||
      this.state.isFixedHeader !== isFixedHeader
    ) {
      this.setState({ isFixedHeader, isHeaderInView });
    }
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton && !isHeaderInView) {
      refreshButton.classList.add('sticky');
    } else if (refreshButton && isHeaderInView) {
      refreshButton.classList.remove('sticky');
    }
    window.isStickyHeader = !isHeaderInView;
    this.prvPos = position.top;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.debouncedHandleScroll);
    this.isPrimeUser = isPrimeUser();
    this.checkAndUpdateMastheadFrame();
    if (getGeoCountry() === 'US') {
      this.defaultL1 = [
        ...this.defaultL1.slice(0, 3),
        {
          name: 'Times Club',
          path: `${TIMESCLUB_CTA_NAV}`,
          gaLabel: 'timesclub',
        },
        ...this.defaultL1.slice(3),
      ];
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.debouncedHandleScroll);
  }

  checkAndUpdateMastheadFrame = () => {
    const { masthead = {} } = this.state;
    const { hideLogoMastHead, headerType } = this.props;
    const isMastheadActive =
      !hideLogoMastHead && !headerType && !!masthead.innovation;
    if (isMastheadActive && masthead.timeout > 0) {
      let newobj = {};
      if (
        masthead.settledFrame &&
        masthead.settledFrame.data &&
        masthead.settledFrame.data.src
      ) {
        newobj = masthead.settledFrame;
      }
      setTimeout(() => {
        this.setState(
          {
            masthead: newobj,
          },
          this.checkAndUpdateMastheadFrame,
        );
      }, masthead.timeout);
    }
  };

  openMenu = () => {
    this.setState({
      openMenu: true,
    });
    sendGaThroughProps({
      data: {
        gaCategory: 'nav_menu',
        gaAction: 'hamburger_menu',
        gaLabel: `hamburger_open`,
      },
    });
  };

  closeMenu = () => {
    this.setState({
      openMenu: false,
    });
  };

  getHomeNode = (homeNode = {}, extLink) => {
    const _headingType = homeNode.headingType || 'h2';
    const CustomTag = `${_headingType}`;
    // const { headerData, showShortLogo } = this.props;
    // const theme = headerData.colorTheme;
    const link = extLink || homeNode.link || '/';
    let linkAttr = {};
    if (extLink) {
      linkAttr = {
        target: '_blank',
      };
    }

    return (
      <CustomTag className={`${s.fulllogo} ${s.snowwhite}`}>
        <Link
          to={link}
          data={{
            gaCategory: 'nav_menu',
            gaAction: 'toi_logo',
            gaLabel: '',
          }}
          title="News"
          alt="News"
          {...linkAttr}
        />
      </CustomTag>
    );
  };

  getEachHeaderItem = val => {
    const { gaCategory } = this.props;
    return (
      <li>
        <Link
          key={val.name}
          to={val.path}
          className={`${val.isTop === 'true' ? s.active : ''} ${
            val.styles ? s[val.styles] : ''
          }`}
          // data={{
          //   gaAction: 'NavBar-SectionClick',
          //   gaLabel: `NavBar-${val.gaLabel || val.name}/${index +
          //     1}`,
          // }}
          onClick={e => {
            if (val.isTop) {
              checkAndRedirectToHomePage(e);
            }

            sendGaThroughProps({
              data: {
                gaCategory: gaCategory || 'nav_menu',
                gaAction: `L1_${val.gaLabel || val.name}`,
                gaLabel: window.location.href,
              },
            });
          }}
        >
          {val.name === 'TOI+' ? '' : val.name}
        </Link>
      </li>
    );
  };

  render() {
    const {
      isFixedHeader,
      openInAppStickyVisible,
      isHeaderInView,
    } = this.state;
    const {
      headerData,
      hideL2Navigation,
      hideOpenInAppTopWidget,
      l1Sections,
      underToneAd,
      killSwitchStatus,
      hideAds,
      headerType,
      headerLabel,
      hideLogoMastHead,
      // geolocation,
    } = this.props;
    const { userData } = this.props;
    const { openInApp, AmzTopDeals, topband, isOpenInApp = false } = headerData;
    const homeNode = headerData.navigation && headerData.navigation.home;
    const { masthead = {} } = this.state;
    const isMastheadActive =
      !hideLogoMastHead && !headerType && !!masthead.innovation;
    const mastHeadLink = isMastheadActive ? masthead.link : '';
    // const isIndiaGeo = !geolocation || geolocation === '1';
    let l1SectionList = this.defaultL1;
    if (l1Sections && l1Sections.length > 0) {
      l1SectionList = l1Sections;
    }
    //let openInAppEmbedded = false;
    // if (
    //   headerData &&
    //   headerData.openInApp &&
    //   headerData.openInApp.position === 'header'
    // ) {
    //   openInAppEmbedded = true;
    // }

    const { data: { ps = null } = {} } = killSwitchStatus || {};
    const ModifiedComponent = AddOrgSchema(
      this.getHomeNode(homeNode, mastHeadLink),
    );
    return (
      <React.Fragment>
        {!hideAds &&
          typeof topband === 'object' && (
            <div className={s.topband}>
              <AdCaller
                data={{
                  ...topband,
                }}
                lazyload={false}
                deviceType="mobile"
              />
            </div>
          )}
        {!topband &&
          !hideOpenInAppTopWidget && (
            <OpenInAppTopWidget
              openInAppToggled={this.openInAppToggled}
              openInAppLink={openInApp && openInApp.path ? openInApp.path : ''}
            />
          )}
        <header
          className={`${s.mobile} ${isFixedHeader ? s.fixHeader : ''} ${
            !isHeaderInView && hideOpenInAppTopWidget ? s.sticky : ''
          }`}
        >
          <div
            className={`${s.headerwrapper} ${headerType && s.noImg} ${
              isMastheadActive ? `${s[masthead.colorTheme]}` : ''
            }`}
            style={
              isMastheadActive
                ? {
                    backgroundColor: masthead.bgcolor || '#fff',
                    backgroundImage: `url(${masthead.data.src})`,
                    backgroundPosition: masthead.bgPosition || 'center',
                    backgroundSize: masthead.bgSize || 'cover',
                    backgroundRepeat: 'no-repeat',
                  }
                : {}
            }
          >
            <div className={s.hamburger} onClick={this.openMenu} />
            <Menu
              closeMenu={this.closeMenu}
              killSwitch={ps}
              data={headerData}
              openMenu={this.state.openMenu}
              editionSwitch={this.props.headerData.editionSwitch}
              currentCountry={this.props.currentCountry}
              notificationCenter={this.props.headerData.notificationCenter}
              showTOIPlus={this.props.showTOIPlus}
              showToiPlusEntryPoints={this.props.showToiPlusEntryPoints}
            />
            <div className={s.header_right}>
              {headerType ? (
                <ListingHeader
                  data={headerType}
                  headerLabel={headerLabel}
                  h1Required
                />
              ) : (
                <>
                  {homeNode && <ModifiedComponent />}
                  <div className={s.header_right_inner}>
                    {isOpenInApp && (
                      <OpenInAppBtn
                        gaCategory="OpenAppHeader"
                        gaAction="click"
                        openappUrl={this.props.openappUrl}
                      />
                    )}
                    {AmzTopDeals &&
                      AmzTopDeals.isPresent && (
                        <WithGeo
                          render={({ geoCountry }) => {
                            if (geoCountry === 'US') {
                              return (
                                <div className={s.AmzTopDeals}>
                                  <a
                                    href={AmzTopDeals.link}
                                    onClick={() => {
                                      gaWrapper(
                                        'send',
                                        'event',
                                        `${AmzTopDeals.ga}`,
                                        `NavBar-AppDownload`,
                                        window.location.href,
                                      );
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {AmzTopDeals.label}
                                  </a>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <Login isMobile />
        <WithTimesPoint isWapView />
        {!hideL2Navigation && (
          <StickyDiv
            stickyClass={classNames({
              [s.stickyHeader]: true,
              [s.stickyHeaderZero]:
                !openInAppStickyVisible || hideOpenInAppTopWidget,
            })}
            outerContainerClass={`${s.l2_navigation_wrapper} ${
              s[headerData.colorTheme]
            }`}
            offsetFromTop={openInAppStickyVisible ? 56 : 0}
          >
            <div className={`${s.l2_navigation}`}>
              <ul>
                {l1SectionList &&
                  l1SectionList.length > 0 &&
                  l1SectionList.map(
                    (val, index) => {
                      if (val.name !== 'TOI+') {
                        return this.getEachHeaderItem(val, index);
                      }
                      if (this.props.showToiPlusEntryPoints && ps) {
                        return this.getEachHeaderItem(val, index);
                      }
                      return null;
                    },
                    //   <li>
                    //     <Link
                    //       key={val.name}
                    //       to={val.path}
                    //       className={`${index === 0 ? s.active : ''} ${
                    //         val.styles ? s[val.styles] : ''
                    //       }`}
                    //       // data={{
                    //       //   gaAction: 'NavBar-SectionClick',
                    //       //   gaLabel: `NavBar-${val.gaLabel || val.name}/${index +
                    //       //     1}`,
                    //       // }}
                    //       onClick={e => {
                    //         if (val.isTop) {
                    //           checkAndRedirectToHomePage(e);
                    //         }

                    //         sendGaThroughProps({
                    //           data: {
                    //             gaCategory: 'nav_menu',
                    //             gaAction: `L1_${val.gaLabel || val.name}`,
                    //             gaLabel: window.location.href,
                    //           },
                    //         });
                    //       }}
                    //     >
                    //       {val.name === 'TOI+' ? '' : val.name}
                    //     </Link>
                    //   </li>
                    // ),
                  )}
              </ul>
            </div>
          </StickyDiv>
        )}
        {typeof underToneAd === 'object' && (
          <WithGeo
            render={({ geoCountry }) => {
              const country =
                typeof geoCountry === 'string' ? geoCountry.toUpperCase() : '';
              if (underToneAd.geo.indexOf(country) > -1) {
                return (
                  <AdCaller
                    data={{
                      ...underToneAd,
                    }}
                    lazyload={false}
                    deviceType="mobile"
                  />
                );
              }
              return null;
            }}
          />
        )}
        {!this.props.isPrivateUser && (
          <OnetapsigninV2
            username={
              userData && typeof userData.getEmail === 'function'
                ? userData.getEmail()
                : ''
            }
            isWapView
          />
        )}
      </React.Fragment>

      // { {this.props.params.isWapView &&
      //   !this.props.isPrivateUser && (
      //     <Onetapsignin
      //       username={
      //         userData && typeof userData.getEmail === 'function'
      //           ? userData.getEmail()
      //           : ''
      //       }
      //       isWapView={this.props.params.isWapView}
      //     />
      //   )} }
    );
  }
}

Header.propTypes = {
  headerData: PropTypes.shape({
    masthead: PropTypes.shape({}),
    editionSwitch: PropTypes.shape({}),
    notificationCenter: PropTypes.shape({}),
  }).isRequired,
  hideL2Navigation: PropTypes.bool,
  hideOpenInAppTopWidget: PropTypes.bool,
  currentCountry: PropTypes.string,
  l1Sections: PropTypes.arrayOf(PropTypes.shape({})),
  showTOIPlus: PropTypes.bool,
  // showShortLogo: PropTypes.bool,
  userData: PropTypes.shape({ getEmail: PropTypes.func }),
  underToneAd: PropTypes.shape({}),
  killSwitchStatus: PropTypes.objectOf({}),
  hideAds: PropTypes.bool,
  // geolocation: PropTypes.string,
  gaCategory: PropTypes.string,
  isOpenInApp: PropTypes.bool,
  headerType: PropTypes.string,
  showToiPlusEntryPoints: PropTypes.bool,
  headerLabel: PropTypes.string,
  hideLogoMastHead: PropTypes.bool,
};
Header.defaultProps = {
  hideL2Navigation: false,
  hideOpenInAppTopWidget: false,
  // openappUrl: '',
  currentCountry: undefined,
  l1Sections: [],
  showTOIPlus: false,
  // showShortLogo: false,
  userData: undefined,
  underToneAd: undefined,
  killSwitchStatus: null,
  hideAds: false,
  // geolocation: '1',
  gaCategory: undefined,
  isOpenInApp: false,
  headerType: '',
  showToiPlusEntryPoints: false,
  headerLabel: '',
  hideLogoMastHead: false,
};

export default Header;
