import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import classNames from 'classnames';
import { bindGa } from 'helpers/analytics';
import {
  debounce,
  isTouch,
  getClassesFromArray,
  // isPrimeUser,
} from 'utils/common';
//import MasterKillSwitch from 'components/ToiSubscription/utils/masterKillSwitch';
import { sendGaThroughProps } from 'helpers/analytics/sendGaThroughProps';
import Image from 'components/Image';
import { WEB_INDIA_HP_GA_CAT, CORONAVIRUS_GA_CATEGORY } from 'constants/index';
import NavDropDown from './NavDropDown';
import NavDropDownList from './NavDropDownList';
import Search from '../Search';
import s from './Navigation.scss';

class Navigation extends React.Component {
  static gaCategory = 'nav_menu';
  constructor(props) {
    super(props);
    this.state = {
      l1Sections:
        props.navigationData && props.navigationData.l1
          ? props.navigationData.l1
          : null,
      l2Sections:
        props.navigationData && props.navigationData.l2
          ? props.navigationData.l2
          : null,
      l1cyclicSections: [],
      l2cyclicSections: [],
      showHamburg: false,
      isClientSide: false,
      //masterKillSwitch: undefined,
    };

    this.l1Items = [];
    this.l2Items = [];
    this.onWindowResize = debounce(this.onWindowResize.bind(this), 300);
    this.callWindowResize = true;
    // this.isPrimeUser = false;
  }

  isGeoInfoPresent = () => {
    if (
      typeof window !== 'undefined' &&
      window.geoinfo &&
      typeof window.geoinfo.CountryCode === 'string'
    ) {
      return window.geoinfo.CountryCode.toLowerCase();
    }
    return false;
  };

  checkIsComponentMounted = () => {
    let geo = this.isGeoInfoPresent();
    if (geo) {
      document.body.classList.add(`geo-${geo}`);
      this.onWindowResize();
    } else {
      /* @todo - need to be done on redux */
      this.timer = setInterval(() => {
        geo = this.isGeoInfoPresent();
        if (geo) {
          document.body.classList.add(`geo-${geo}`);
          this.onWindowResize();
          clearInterval(this.timer);
        }
      }, 1000);
      // clear interval after 5sec if not executed.
      setTimeout(() => {
        clearInterval(this.timer);
      }, 5000);
    }
  };

  handleDocumentClickEvent = event => {
    if (isTouch()) {
      const clickedElement = event.target;
      let clickedElementDrowdown;
      let clickedElementWithSubmenu;
      let elementVisible;
      if (clickedElement.parentNode) {
        clickedElementDrowdown = clickedElement.parentNode.querySelector(
          `.${s.dropdown}`,
        );

        clickedElementWithSubmenu = clickedElement.parentNode.querySelector(
          '.submenu-dropdown',
        );
      }
      if (clickedElementDrowdown) {
        const opacity = window
          .getComputedStyle(clickedElementDrowdown)
          .getPropertyValue('opacity');
        elementVisible = !!parseInt(opacity, 10);
        if (
          !!clickedElement.closest('nav') &&
          clickedElement.parentNode.querySelector(`.${s.dropdown_arrow}`) &&
          !elementVisible
        ) {
          event.preventDefault();
          return false;
        }
      } else if (clickedElementWithSubmenu) {
        const opacity = window
          .getComputedStyle(clickedElementWithSubmenu)
          .getPropertyValue('opacity');
        elementVisible = !!parseInt(opacity, 10);
        if (!!clickedElementWithSubmenu.closest('nav') && !elementVisible) {
          event.preventDefault();
          return false;
        }
      }
    }
    return true;
  };
  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClickEvent);
    window.removeEventListener(
      'GUTTER_AD_TYPE_HANDLING',
      this.gutterAdTypeHandling,
    );
    window.removeEventListener(
      'GUTTER_CLOSE_AD_TYPE_HANDLING',
      this.gutterAdTypeHandling,
    );
  }

  gutterAdTypeHandling = () => {
    //In case of gutter ads, triggering the resize event
    setTimeout(this.onWindowResize, 2000);
  };

  componentDidMount() {
    const { pageType } = this.props;
    // this.isPrimeUser = isPrimeUser();
    Navigation.gaCategory =
      pageType && pageType === 'Home'
        ? WEB_INDIA_HP_GA_CAT
        : Navigation.gaCategory;
    this.setCyclicItems();
    document.addEventListener('click', this.handleDocumentClickEvent);
    if (window) {
      window.addEventListener('resize', this.onWindowResize);
      window.addEventListener(
        'GUTTER_AD_TYPE_HANDLING',
        this.gutterAdTypeHandling,
      );
      window.addEventListener(
        'GUTTER_CLOSE_AD_TYPE_HANDLING',
        this.gutterAdTypeHandling,
      );
    }

    this.checkIsComponentMounted();
    // window.top.adsCallback = adtype => {
    //   if (adtype === 'gutter') {
    //     this.gutterAdTypeHandling();
    //   }
    // };

    if (typeof window !== 'undefined') {
      this.setState({ isClientSide: true });
    }
    // MasterKillSwitch(this.props.isWapView).then(data => {
    //   const { data: paymentStatus } = data;
    //   this.setState({
    //     masterKillSwitch: paymentStatus.ps,
    //     // masterKillSwitch: false,
    //   });
    // });
  }

  componentDidUpdate() {
    // if timestamp is updated then ???
    // this is causing infinite setstate
    // this.setStateWithProps(this.props);
    if (this.callWindowResize) {
      this.onWindowResize();
      this.callWindowResize = false;
    }
  }

  componentWillUnmount = () => {
    if (window) window.removeEventListener('resize', this.onWindowResize);
  };

  onWindowResize = () => {
    this.setStateWithProps(this.props);
  };

  setStateWithProps = props => {
    this.l1Items = [];
    this.l2Items = [];
    this.setState(
      {
        l1Sections:
          props.navigationData && props.navigationData.l1
            ? props.navigationData.l1
            : null,
        l1cyclicSections: [],
        l2Sections:
          props.navigationData && props.navigationData.l2
            ? props.navigationData.l2
            : null,
        l2cyclicSections: [],
      },
      this.setCyclicItems,
    );
  };

  setCyclicItems = () => {
    const { hideCyclicNav } = this.props;
    const dotsWidth = hideCyclicNav ? 0 : 55;
    const l1TotalWidth =
      this.l1navContainer && this.l1Items.length
        ? this.l1navContainer.offsetWidth - (dotsWidth + 30)
        : 0;
    const l2TotalWidth =
      this.l2navContainer && this.l2Items.length
        ? this.l2navContainer.offsetWidth - (dotsWidth + 20)
        : 0;
    let currentWidth = 0;
    const l1Sections = [];
    const l1cyclicSections = [];
    const l2Sections = [];
    const l2cyclicSections = [];

    this.l1Items.forEach((item, index) => {
      currentWidth += item.offsetWidth;
      if (currentWidth > l1TotalWidth) {
        l1cyclicSections.push(this.state.l1Sections[index]);
      } else {
        l1Sections.push(this.state.l1Sections[index]);
      }
    });

    currentWidth = 0;
    this.l2Items.forEach((item, index) => {
      currentWidth += item.offsetWidth;
      if (currentWidth > l2TotalWidth) {
        l2cyclicSections.push(this.state.l2Sections[index]);
      } else {
        l2Sections.push(this.state.l2Sections[index]);
      }
    });

    if (l1cyclicSections.length || l2cyclicSections.length) {
      this.setState({
        l1Sections,
        l1cyclicSections,
        l2Sections,
        l2cyclicSections,
      });
    }
  };

  getCyclicMenu = (cyclicSections, navLevel) => {
    const secData = [];
    const chunkset = 15;
    const colno = Math.ceil(cyclicSections.length / chunkset);
    const colstyleName = `col${colno}`;

    if (cyclicSections && cyclicSections.length) {
      cyclicSections.forEach(cyclicSec => {
        const gaLabel = `${Navigation.gaCategory}|L${navLevel}_more_menu|${
          cyclicSec.label
        }`;

        secData.push(
          <li
            className={`${s.list_item} ${s.cyclicItem}`}
            key={cyclicSec.label}
          >
            <Link to={cyclicSec.link} className={s.nav_link} data-ga={gaLabel}>
              {cyclicSec.label}
            </Link>
            {navLevel === 1 && (
              <React.Fragment>
                <meta itemProp="name" content={cyclicSec.label} />
                <meta itemProp="url" content={cyclicSec.link} />
              </React.Fragment>
            )}
          </li>,
        );
      });
      return (
        <li
          className={`${s.nav_item} hello ${s.cyclicContainer}`}
          key="cyclicContainer"
        >
          <span className={s.dots}>
            <i />
          </span>
          <div className={`${s.dropdown} ${s.multi_list} ${s[colstyleName]}`}>
            <div className={`${s.list0}`}>
              <ul key="cyclicList">{secData}</ul>
            </div>
          </div>
        </li>
      );
    }
    return null;
  };

  navigationOnHover = (item, level, index) => {
    if (level !== 1 || !item || !(item.wu || item.subMenu)) {
      return;
    }

    const navHoverKey = `hover-${index}`;

    if (this.state.navHoverKey !== navHoverKey) {
      this.setState({ navHoverKey });
    }
  };

  removeNavigationHover = (level, index) => {
    if (level !== 1) {
      return;
    }

    const navHoverKey = `hover-${index}`;

    if (this.state.navHoverKey === navHoverKey) {
      this.setState({ navHoverKey: '' });
    }
  };

  hasAnySubmenuUrl = subMenu => {
    let hasWebUrl = false;
    let counter = 0;
    for (; counter < subMenu.length; counter += 1) {
      if (subMenu[counter].wu) {
        hasWebUrl = true;
        break;
      }
    }

    return hasWebUrl;
  };

  backButtonHandler = link => {
    window.location.href = link;
  };

  iterateOverObject = (
    sections,
    classname,
    navLevel,
    secHead,
    colorTheme,
    backButton,
  ) => {
    const secData = [];
    const { pageType } = this.props;
    if (sections && sections.length > 0) {
      const sectionLength = sections.length;
      sections.forEach((navSec, index) => {
        //const navSec = sections[key];
        let _ga = '';
        if (pageType && pageType === 'Home') {
          _ga = `${Navigation.gaCategory}|Navbar${
            secHead ? `_${secHead}` : ''
          }_${navSec.label}|${navSec.link}`;
        } else if (secHead) {
          _ga = `${Navigation.gaCategory}|L1_child|${secHead}/${navSec.label}`;
        }
        let customClasses = '';
        let customClassesDynamic = '';

        if (navSec.styles && navSec.styles.length) {
          customClassesDynamic = getClassesFromArray(navSec.styles, s);
        }
        if (navLevel === 1 && navSec.selected) {
          customClasses = index === 0 ? s.root : s.level1;
        } else if (navLevel === 2 && navSec.selected) {
          customClasses = s.level2;
        }
        if (
          (navLevel === 1 || navLevel === 2) &&
          pageType &&
          pageType === 'Home'
        ) {
          _ga = `${Navigation.gaCategory}|Navbar_${navSec.label}|${
            navSec.link
          }`;
        } else if (navLevel === 1 || navLevel === 2) {
          _ga = `${Navigation.gaCategory}|L${navLevel}_parent|${navSec.label}`;
        }
        if (
          typeof backButton === 'object' &&
          backButton.link &&
          navLevel === 2 &&
          index === 0 &&
          navSec.selected
        ) {
          secData.push(
            <li
              className={s.back}
              onClick={() => {
                this.backButtonHandler(backButton.link);
              }}
            />,
          );
        }
        secData.push(
          <li
            className={`${classname} ${customClassesDynamic} ${customClasses} ${
              navSec.selected && colorTheme ? s[colorTheme] : ''
            } ${navSec.theme ? navSec.theme : ''}`}
            ref={el => {
              if (el && navLevel === 1) {
                this.l1Items.push(el);
              } else if (el && navLevel === 2) {
                this.l2Items.push(el);
              }
            }}
            key={navSec.label}
            onMouseOver={() => {
              this.navigationOnHover(navSec, navLevel, index);
            }}
            onMouseOut={() => {
              this.removeNavigationHover(navLevel, index);
            }}
          >
            <Link
              to={navSec.link}
              className={`${s.nav_link} ${
                navLevel === 2 ? s.nav_link_l2 : ''
              } ${
                `hover-${index}` === this.state.navHoverKey ? s.activeNav : null
              }`}
              data-ga={_ga}
            >
              {/* support for banners on navigation */}
              {navSec.theme && navSec.theme === 'times_health_survey' ? (
                <Image
                  src="https://static.toiimg.com/photo/72184087.cms"
                  lazyload
                  placeHolderSrc="https://static.toiimg.com/photo/34824568.cms"
                  offsetVertical={100}
                  alt={navSec.label}
                />
              ) : (
                navSec.label
              )}
            </Link>
            {navLevel === 1 ? (
              <React.Fragment>
                <meta itemProp="name" content={navSec.label} />
                <meta itemProp="url" content={navSec.link} />
                {navSec.wu &&
                  this.state.isClientSide && (
                    <NavDropDown
                      item={navSec}
                      activeNavHoverKey={this.state.navHoverKey}
                      hoverKey={`hover-${index}`}
                      // postionRight={index + 1 > sectionLength / 2}
                      postionRight={
                        sectionLength > 4
                          ? index + 1 > sectionLength / 2
                          : false
                      }
                      colorTheme={colorTheme}
                    />
                  )}
                {navSec.subMenu &&
                  navSec.subMenu.length > 0 &&
                  this.hasAnySubmenuUrl(navSec.subMenu) &&
                  this.state.isClientSide && (
                    <NavDropDownList
                      item={navSec}
                      activeNavHoverKey={this.state.navHoverKey}
                      hoverKey={`hover-${index}`}
                      // postionRight={index + 1 > sectionLength / 2}
                      postionRight={
                        sectionLength > 4
                          ? index + 1 > sectionLength / 2
                          : false
                      }
                      theme={navSec.theme}
                      colorTheme={colorTheme}
                      pageType={pageType}
                    />
                  )}
              </React.Fragment>
            ) : null}
            {navSec.subMenuList ? <span className={s.dropdown_arrow} /> : null}
            {navSec.subMenuList ? this.getNavChild(navSec.subMenuList) : null}
          </li>,
        );
      });
    }
    if (navLevel === 1) {
      return (
        <ul
          itemType="http://www.schema.org/SiteNavigationElement"
          itemScope="itemscope"
          key="levelOneList"
        >
          {secData}
          {this.getCyclicMenu(this.state.l1cyclicSections, navLevel)}
        </ul>
      );
    } else if (navLevel === 2) {
      return (
        <ul key="levelTwoList">
          {secData}
          {this.getCyclicMenu(this.state.l2cyclicSections, navLevel)}
        </ul>
      );
    }
    return <ul key="navChildList">{secData}</ul>;
  };

  getNavChild = obj => {
    switch (obj.type) {
      case 'multiList': {
        const multiList = [];
        if (obj.data && obj.data.length > 0) {
          obj.data.forEach((sec, index) => {
            const indexSpecificClass = `list${index}`;
            multiList.push(
              <div
                className={`${s[indexSpecificClass]}`}
                //className={`${s.list} ${s[indexSpecificClass]}`}
                key={sec.label}
              >
                {sec.label && <h4 className={s.list_title}>{sec.label}</h4>}
                {this.iterateOverObject(
                  sec.data,
                  `${s.list_item}`,
                  undefined,
                  sec.label,
                )}
              </div>,
            );
          });
          return (
            <div className={`${s.dropdown} ${s.multi_list}`}>{multiList}</div>
          );
        }
        break;
      }
      case 'multiList2': {
        //multiList2 is without label
        const multiList = [];
        if (obj.data && obj.data.length > 0) {
          obj.data.forEach(sec => {
            multiList.push(
              <div className={`${s.list1}`} key={sec.label}>
                {this.iterateOverObject(
                  sec.data,
                  `${s.list_item}`,
                  undefined,
                  sec.label,
                )}
              </div>,
            );
          });
          return (
            <div className={`${s.dropdown} ${s.multi_list}`}>{multiList}</div>
          );
        }
        break;
      }
      default:
        return null;
    }
    return null;
  };

  @bindGa({})
  showHamburgIcon() {
    this.setState({
      showHamburg: true,
    });

    this.sendHamburgerGA(true);
  }

  showCloseIcon() {
    this.setState({
      showHamburg: false,
    });
    this.sendHamburgerGA(false);
  }

  sendHamburgerGA = isOpen => {
    sendGaThroughProps({
      data: {
        gaCategory: `${Navigation.gaCategory}`,
        gaAction: 'L1_hamburger_icon',
        gaLabel: `${isOpen ? 'Open' : 'Close'}`,
      },
    });
  };

  getAllSectionsData = (
    data,
    type = `
  hamburger`,
  ) => {
    const allSecData = [];
    if (data && data.sections) {
      const allSections = data.sections;
      let colData = [];
      allSections.forEach(menucolumn => {
        menucolumn.forEach(sec => {
          let heading;
          const subSecsData = [];
          if (sec.link) {
            heading = (
              <h3 className={s.allcat_head}>
                <Link to={sec.link} data-ga={`${type}_menu|${sec.label}|`}>
                  {sec.label}
                </Link>
              </h3>
            );
          } else {
            heading = <h3 className={s.allcat_head}>{sec.label}</h3>;
          }
          if (sec.items && sec.items.length > 0) {
            const subSecs = sec.items;
            subSecs.forEach(subsec => {
              subSecsData.push(
                <li>
                  <Link
                    to={subsec.link}
                    data-ga={`${type}_menu|${subsec.label}|`}
                    key={subsec.label}
                  >
                    {subsec.label}
                  </Link>
                </li>,
              );
            });
          }
          colData.push(
            <div className={s.all_sec_cat}>
              {heading}
              <ul>{subSecsData}</ul>
            </div>,
          );
        });
        allSecData.push(<div className={s.menu_column}>{colData}</div>);
        colData = [];
      });
    }
    return <div className={s.allSections}>{allSecData}</div>;
  };

  getHomeNode = (homeNode = {}) => {
    const _headingType = homeNode.headingType || 'h2';
    const { showHomeOnlyWhenSticky, pageType } = this.props;
    const CustomTag = `${_headingType}`;
    if (
      typeof pageType !== 'undefined' &&
      (pageType === 'Home' || pageType === 'HomeUs')
    ) {
      return null;
    }
    return (
      <div
        itemType="https://schema.org/Organization"
        itemScope="itemscope"
        itemProp="publisher"
        className={`${s.logowrapper} ${classNames({
          [s.homeOnlySticky]: showHomeOnlyWhenSticky,
        })}`}
      >
        <CustomTag>
          <Link
            to={homeNode.link || '/'}
            className={s['toi-logo']}
            data-ga={`${Navigation.gaCategory}|L1_toi_logo|home`}
            title="News"
            alt="News"
          >
            TOI
          </Link>
        </CustomTag>
        <span
          itemType="https://schema.org/ImageObject"
          itemScope="itemscope"
          itemProp="logo"
        >
          <meta
            content="https://static.toiimg.com/photo/msid-58127550/toilogo.jpg"
            itemProp="url"
          />
          <meta content="600" itemProp="width" />
          <meta content="60" itemProp="height" />
        </span>
        <meta content="Times of India" itemProp="name" />
        <meta content="https://timesofindia.indiatimes.com" itemProp="url" />
      </div>
    );
  };
  /**
   *  function to get GA category
   * @param {*} pageType
   * @param {*} stickyHeader
   */
  getGaCategory = (pageType, stickyHeader) => {
    if (pageType && pageType === 'Home') {
      return WEB_INDIA_HP_GA_CAT;
    } else if (pageType && pageType === 'coronavirus') {
      return `${CORONAVIRUS_GA_CATEGORY}_WEB`;
    } else if (stickyHeader) {
      return 'sticky_nav_menu';
    }
    return 'nav_menu';
  };

  render() {
    const {
      allMenu,
      navigationData,
      stickyHeader,
      colorTheme,
      hideCyclicNav,
      pageType,
      killSwitchStatus,
      geolocation,
      showToiPlusEntryPoints,
    } = this.props;
    const hamburgIcon = !this.state.showHamburg
      ? `${s.hamburg_icon}`
      : `${s.close_icon}`;
    Navigation.gaCategory = this.getGaCategory(pageType, stickyHeader);
    const theme = colorTheme ? s[colorTheme] : s.rust;
    const isL1Exist = this.state.l1Sections && this.state.l1Sections.length;
    const isL2Exist = this.state.l2Sections && this.state.l2Sections.length;
    const IndiaGeo = !geolocation || geolocation === '1';
    const { data: { ps = null } = {} } = killSwitchStatus || {};
    if (isL1Exist) {
      return (
        <div
          className={`${s.navwrapper} ${theme} ${classNames({
            [s.l2Exist]: isL2Exist,
            [s.hideCyclicNav]: hideCyclicNav,
            [s.fixheader]: stickyHeader,
          })}`}
        >
          <div className={`${s.navigation} ${'navigation'}`}>
            {navigationData.l1 && (
              <div
                className={`${s.l1section}
                ${
                  typeof navigationData.leftNav !== 'undefined'
                    ? s.toiplusBtn
                    : ''
                }
                 ${colorTheme === 'snowwhite' ? s.navV2 : ''}`}
              >
                <div
                  className={`contentwrapper rpos ${
                    !showToiPlusEntryPoints &&
                    (pageType === 'HomeUs' || pageType === 'Home')
                      ? 'hidelogo'
                      : ''
                  }`}
                >
                  {navigationData.home && this.getHomeNode(navigationData.home)}
                  <div
                    className={s.l1navListWrapper}
                    ref={el => {
                      if (el) {
                        this.l1navContainer = el;
                      }
                    }}
                  >
                    {navigationData &&
                    navigationData.leftNav instanceof Array &&
                    showToiPlusEntryPoints &&
                    ps
                      ? navigationData.leftNav.map(item => (
                          <Link
                            to={item.link}
                            className={`${s[item.css]} ${
                              !IndiaGeo ? s.other : ''
                            }`}
                            data-ga={
                              pageType === 'Home'
                                ? `${Navigation.gaCategory}|Navbar_${
                                    item.label
                                  }|${item.link}`
                                : ''
                            }
                          >
                            {item.label}
                          </Link>
                        ))
                      : null}
                    <nav
                      className={`${s.nav_list} nav_links_wrapper`}
                      ref={el => {
                        if (el) {
                          this.l1navContainer = el;
                        }
                      }}
                    >
                      {this.iterateOverObject(
                        this.state.l1Sections,
                        `${s.nav_item}`,
                        1,
                        undefined,
                        colorTheme,
                        navigationData.back,
                      )}
                    </nav>
                    {navigationData &&
                    navigationData.rightNav instanceof Array &&
                    this.props.showToiPlusEntryPoints &&
                    ps
                      ? navigationData.rightNav.map(item => (
                          <Link
                            to={item.link}
                            className={`${s[item.css]} ${
                              !IndiaGeo ? s.other : ''
                            }`}
                            data-ga={
                              pageType === 'Home'
                                ? `${Navigation.gaCategory}|Navbar_${
                                    item.label
                                  }|${item.link}`
                                : ''
                            }
                          >
                            {item.label}
                          </Link>
                        ))
                      : null}
                  </div>
                  <Search
                    theme={colorTheme}
                    isWapView={this.props.isWapView}
                    sticky={stickyHeader}
                    highlightSearchedWordInResult
                  />
                  <div
                    className={`hamburg ${hamburgIcon}`}
                    onClick={e => {
                      if (this.state.showHamburg) {
                        this.showCloseIcon(e);
                      } else {
                        this.showHamburgIcon(e);
                      }
                    }}
                  >
                    <span />
                  </div>
                  {this.state.showHamburg &&
                    this.getAllSectionsData(allMenu, 'hamburger')}
                </div>
              </div>
            )}
            {navigationData.l2 && (
              <>
                <div className={s.l2section}>
                  <div className="contentwrapper rpos">
                    <div
                      className={s.l2navListWrapper}
                      ref={el => {
                        if (el) {
                          this.l2navContainer = el;
                        }
                      }}
                    >
                      <nav className={`${s.nav_list} nav_links_wrapper`}>
                        {this.iterateOverObject(
                          this.state.l2Sections,
                          `${s.nav_item}`,
                          2,
                          undefined,
                          '',
                          navigationData.back,
                        )}
                      </nav>
                    </div>
                  </div>
                </div>
                {this.props.l2navigationChild && (
                  <div>{this.props.l2navigationChild}</div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  }
}

Navigation.propTypes = {
  navigationData: PropTypes.shape({
    home: PropTypes.shape({}),
    l1: PropTypes.arrayOf.isRequired,
    l2: PropTypes.arrayOf,
    colorTheme: PropTypes.string,
    back: PropTypes.shape({}),
    rightNav: PropTypes.arrayOf,
  }),
  allMenu: PropTypes.shape({}).isRequired,
  colorTheme: PropTypes.string,
  isWapView: PropTypes.bool.isRequired,
  stickyHeader: PropTypes.bool,
  l2navigationChild: PropTypes.shape({}),
  hideCyclicNav: PropTypes.bool,
  showHomeOnlyWhenSticky: PropTypes.bool.isRequired,
  pageType: PropTypes.string,
  killSwitchStatus: PropTypes.objectOf({}),
  showToiPlusEntryPoints: PropTypes.bool,
};

Navigation.defaultProps = {
  stickyHeader: false,
  colorTheme: '',
  navigationData: {
    home: null,
    l1: [],
    l2: [],
  },
  hideCyclicNav: false,
  l2navigationChild: null,
  pageType: '',
  killSwitchStatus: null,
  showToiPlusEntryPoints: false,
};

export default Navigation;
