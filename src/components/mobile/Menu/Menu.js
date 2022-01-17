import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _get from 'lodash.get';
// import { isUser } from 'components/Login/User';
import { logOutEventEmitter } from 'components/Login/Login';
import { isPrimeUser, wait } from 'utils/common';
import Link from 'components/Link';
import { sendGaThroughProps } from 'helpers/analytics/sendGaThroughProps';
import { toggleLoginBox } from 'components/Login/redux';
import { bindGa } from 'helpers/analytics';
import EditionSwitch from 'components_v2/common/EditonSwitch';
import TimesClub from 'components_v2/mobile/TimesClub';
import NotificationCenter from 'components_v2/mobile/NotificationCenter';
import MenuDropDown from './MenuDropDown';
import SearchWrapper from '../SearchWrapper';
import s from './Menu.scss';
// import Submenu from '../Submenu';

function getTPTextVal(userTimesPoint, isLoggedIn) {
  let returnVal = '';
  if (isLoggedIn && userTimesPoint > 0) {
    returnVal = <React.Fragment>{userTimesPoint} TimesPoints</React.Fragment>;
  } else if (!isLoggedIn) {
    if (userTimesPoint > 0) {
      returnVal = (
        <React.Fragment>Claim your {userTimesPoint} TimesPoints</React.Fragment>
      );
    } else {
      returnVal = (
        <React.Fragment>
          Read & earn <b>TimesPoints</b>
        </React.Fragment>
      );
    }
  }

  return returnVal;
}
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClientSide: false,
    };
    this.gaAction = 'NavBar-Hamburger';
  }
  // setUserData(userData) {
  //   try {
  //     this.setState({
  //       // user: user,
  //       firstName:
  //         userData && typeof userData.getName === 'function'
  //           ? userData.getName()
  //           : '',
  //       // thumbImg: userData.getThumb(),
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  @bindGa({})
  static handleClick() {
    // this function is sandwiched in bindGa
  }

  componentDidMount() {
    this.setState({ isClientSide: true });
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.openMenu && this.props.openMenu) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        this.setState({
          mounted: true,
        });
      }, 0);
    } else if (prevProps.openMenu && !this.props.openMenu) {
      document.body.style = '';
    }
    // const { userData: prevUserData } = prevProps;
    // const { userData: nextUserData } = this.props;
    const prevIsLoggedin = _get(prevProps, 'userData.isLoggedIn');
    const nextIsLoggedin = _get(this.props, 'userData.isLoggedIn');
    // if (prevIsLoggedin !== nextIsLoggedin) {
    //   this.setUserData(nextUserData);
    // }

    if (prevIsLoggedin === false && nextIsLoggedin === true) {
      sendGaThroughProps({
        data: {
          gaAction: this.gaAction,
          gaLabel: 'Hamburger-Login',
        },
      });
    }
  }

  openSearch = () => {
    this.setState({
      openSearch: true,
    });
    sendGaThroughProps({
      data: {
        gaCategory: 'nav_menu',
        gaAction: 'search_icon',
        gaLabel: '',
      },
    });
  };

  closeSearch = () => {
    this.setState({
      openSearch: false,
    });
    sendGaThroughProps({
      data: {
        gaAction: 'NavBar-Search',
        gaLabel: `Search-Close`,
      },
    });
  };

  closeMenuLocal = async () => {
    this.setState({ mounted: false });
    await wait(500); // this value should be same as that of css transition
    this.props.closeMenu();
    sendGaThroughProps({
      data: {
        gaAction: this.gaAction,
        gaLabel: `Hamburger-Exit`,
      },
    });
  };
  isUSGeoInfoPresent = () =>
    typeof window !== 'undefined' &&
    window.geoinfo &&
    typeof window.geoinfo.CountryCode === 'string' &&
    window.geoinfo.CountryCode === 'US';

  isIPhone = () => navigator.userAgent.toLowerCase().indexOf('iphone') >= 0;

  // openDropDown = async () => {
  //   await wait(500);
  //   this.setState({
  //     openDropDown: false,
  //   });
  // };

  render() {
    const containerClassName = classNames({
      [s.menu]: true,
      [s.open]: this.props.openMenu,
      [s.showanimation]: this.state.mounted,
    });

    const isLoggedin = _get(this.props, 'userData.isLoggedIn');
    const {
      userPointsData = {},
      isPrime,
      data = {},
      notificationCenter,
    } = this.props;

    const userTimesPoint =
      userPointsData && userPointsData.points
        ? parseInt(userPointsData.points || 0, 10)
        : 0;

    const { navigation = {} } = data;
    const hamburgerlist = navigation.hamburger;
    const { points } = userPointsData;
    const { userData } = this.props;
    const isPrimeFromCookie =
      this.state.isClientSide && isLoggedin && isPrimeUser();
    let thumbImg = '';
    let firstName = '';
    if (isLoggedin) {
      thumbImg = userData.getThumb() || thumbImg;
      firstName =
        userData && typeof userData.getName === 'function'
          ? userData.getName()
          : '';
    }

    return (
      <div className={containerClassName}>
        <div className={s.menuwrapper}>
          <div className={s.top}>
            <div className={s.actionwrapper}>
              <i className={s.back} onClick={this.closeMenuLocal} />
              <div className={`${s.search}`} onClick={this.openSearch} />
              {this.state.openSearch ? (
                <SearchWrapper closeSearch={this.closeSearch} isWapView />
              ) : null}
              {notificationCenter &&
                notificationCenter.datUrl && (
                  <NotificationCenter
                    {...notificationCenter}
                    dataUrl={notificationCenter.datUrl}
                  />
                )}
            </div>
            {!isLoggedin && (
              <React.Fragment>
                <div className={`${s.userwrapper} ${s.notloggedin}`}>
                  <span className={s.default_thumb} />
                  <span className={s.userinfo}>
                    <span className={s.name}>Welcome! to timesofindia.com</span>
                    <span className={s.email}>
                      <Link
                        target="_blank"
                        to="https://m.timesofindia.com/timespoints"
                        data-ga="Earn_Timespoint|open|Hamburger"
                      >
                        {getTPTextVal(userTimesPoint, false)}
                      </Link>
                    </span>
                    <button
                      className={s.signbtn}
                      onClick={this.props.toggleLoginBox}
                    >
                      Sign In / Register{' '}
                    </button>
                  </span>
                </div>
              </React.Fragment>
            )}

            {isLoggedin && (
              <React.Fragment>
                <div className={s.userwrapper}>
                  <span
                    className={`${isPrime || isPrimeFromCookie ? s.prime : ''}`}
                  >
                    <img
                      src={thumbImg}
                      alt=""
                      className={`${s.default_thumb} ${
                        isPrime || isPrimeFromCookie ? s.prime : ''
                      }`}
                    />
                  </span>
                  <span className={s.userinfo}>
                    <span
                      className={`${s.name} ${
                        isPrime || isPrimeFromCookie ? s.primeuser : ''
                      }`}
                    >
                      {firstName}
                    </span>
                    {points &&
                      parseInt(points, 10) > 0 && (
                        <div className={s.tp_wrapper}>
                          <span>
                            <Link
                              target="_blank"
                              to="https://m.timesofindia.com/timespoints"
                              data-ga="Earn_Timespoint|open|Hamburger"
                            >
                              {getTPTextVal(userTimesPoint, true)}
                            </Link>
                          </span>
                          <Link
                            to="https://www.timespoints.com/products"
                            target="_blank"
                            rel="nofollow noreferrer"
                            data={{
                              gaAction: this.gaAction,
                              gaLabel: `Hamburger-Redeem`,
                            }}
                          >
                            Redeem
                          </Link>
                        </div>
                      )}
                  </span>
                </div>
              </React.Fragment>
            )}
          </div>
          {this.props.editionSwitch && (
            <EditionSwitch
              editionSwitch={this.props.editionSwitch}
              showTOIPlus={this.props.showTOIPlus}
              killSwitch={this.props.killSwitch}
              isPrimeUser={this.props.isPrime}
              showToiPlusEntryPoints={this.props.showToiPlusEntryPoints}
            />
          )}
          {hamburgerlist instanceof Array && (
            <div className={s.menulinks}>
              {(this.isUSGeoInfoPresent() ||
                this.props.currentCountry === 'US') &&
                this.isIPhone() && (
                  <TimesClub ga="WAP-US-NHP1#NavBar-Hamburger#timesclub_click" />
                )}
              <div
                className={s.linkswrapper}
                itemType="http://www.schema.org/SiteNavigationElement"
                itemScope="itemscope"
                key="levelOneList"
              >
                {/* <Link to="/" className={`${s.home} ${s.active}`}>
                  Home
                </Link> */}
                {hamburgerlist.map((firstLevelItem, index) => {
                  const isDropDownItem =
                    typeof firstLevelItem.subMenuList === 'object';
                  const dynamicFeedLinkClassName = firstLevelItem.label
                    ? s[
                        firstLevelItem.label
                          .toLowerCase()
                          .split(' ')
                          .join('')
                          .replace('&', '_')
                      ]
                    : undefined;
                  const linkClassName = classNames({
                    [dynamicFeedLinkClassName]: true,
                    [s.submenu_icon]: isDropDownItem,
                  });
                  if (isDropDownItem) {
                    return (
                      <MenuDropDown
                        key={`Hamburger-L1_${firstLevelItem.label}/${index +
                          1}`}
                        linkItem={firstLevelItem}
                        linkClassName={linkClassName}
                        activeLinkClassName={s.arrowlink}
                        data={{
                          gaCategory: 'hamburger_menu',
                          gaAction: firstLevelItem.label,
                          gaLabel: '',
                        }}
                      />
                    );
                  }

                  return (
                    <React.Fragment
                      key={`Hamburger-L1_${firstLevelItem.label}/${index + 1}`}
                    >
                      <Link
                        to={firstLevelItem.link}
                        className={linkClassName}
                        onClick={e => {
                          Menu.handleClick(e);
                        }}
                        data-ga={`hamburger_menu|${firstLevelItem.label}|`}
                      >
                        {firstLevelItem.icon && (
                          <i
                            className={s.externalLink}
                            style={{
                              background: `url(${
                                firstLevelItem.icon.imgurl
                              }) no-repeat center`,
                            }}
                          />
                        )}
                        {firstLevelItem.label}
                        <meta itemProp="name" content={firstLevelItem.label} />
                        <meta itemProp="url" content={firstLevelItem.link} />
                      </Link>
                    </React.Fragment>
                  );
                })}

                {isLoggedin && (
                  <div
                    onClick={() => {
                      sendGaThroughProps({
                        data: {
                          gaAction: this.gaAction,
                          gaLabel: 'Hamburger-Logout',
                        },
                      });
                      logOutEventEmitter();
                    }}
                    className={`${s.logout} ${s.inline_link}`}
                  >
                    logout
                  </div>
                )}
              </div>
            </div>
          )}
          <div className={s.socialwrapper}>
            <span>Follow us on</span>
            <Link
              to="https://www.facebook.com/TimesofIndia/"
              target="_blank"
              data={{
                gaCategory: 'hamburger_menu',
                gaAction: 'social_channel_icons',
                gaLabel: '',
              }}
            >
              <i className={s.fb} />
            </Link>
            <Link
              to="https://twitter.com/timesofindia"
              target="_blank"
              data={{
                gaCategory: 'hamburger_menu',
                gaAction: 'social_channel_icons',
                gaLabel: '',
              }}
            >
              <i className={s.twit} />
            </Link>
            <Link
              to="https://www.linkedin.com/company/thetimesofindia/"
              target="_blank"
              data={{
                gaCategory: 'hamburger_menu',
                gaAction: 'social_channel_icons',
                gaLabel: '',
              }}
            >
              <i className={s.linkedin} />
            </Link>
            {/* <Link to="https://www.facebook.com/TimesofIndia/" target="_blank">
              <i className={s.pin} />
            </Link> */}
            <Link
              to="https://www.youtube.com/channel/UCckHqySbfy5FcPP6MD_S-Yg"
              target="_blank"
              data={{
                gaCategory: 'hamburger_menu',
                gaAction: 'social_channel_icons',
                gaLabel: '',
              }}
            >
              <i className={s.youtube} />
            </Link>
          </div>
        </div>
        <div className={s.closemenu} onClick={this.closeMenuLocal} />
      </div>
    );
  }
}

Menu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    getName: PropTypes.func,
  }),
  data: PropTypes.shape({}).isRequired,
  userPointsData: PropTypes.shape({}),
  isPrime: PropTypes.bool,
  toggleLoginBox: PropTypes.func.isRequired,
  openMenu: PropTypes.bool.isRequired,
  editionSwitch: PropTypes.shape({}),
  notificationCenter: PropTypes.shape({}),
  currentCountry: PropTypes.string,
  showTOIPlus: PropTypes.bool,
  killSwitch: PropTypes.bool,
  showToiPlusEntryPoints: PropTypes.bool,
};
Menu.defaultProps = {
  userData: undefined,
  userPointsData: undefined,
  isPrime: false,
  editionSwitch: undefined,
  notificationCenter: {},
  currentCountry: undefined,
  showTOIPlus: false,
  killSwitch: false,
  showToiPlusEntryPoints: false,
};
const mapStateToProps = state => ({
  userData: _get(state, 'login.userData'),
  isPrivateUser: state.gdpr.isPrivateUser,
  userPointsData: state.timesPoint ? state.timesPoint.userData : {},
  isPrimeUser: state.isPrime,
});
const mapDispatchToProps = dispatch => ({
  toggleLoginBox: params => {
    dispatch(toggleLoginBox(params));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Menu);
