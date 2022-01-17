import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import NavDropDown from './NavDropDown';
import s from './NavDropDownList.scss';

class NavDropDownList extends React.Component {
  constructor() {
    super();
    this.state = {
      navHoverKey: '',
      loaded: false,
    };
  }

  componentDidUpdate() {
    if (
      !this.state.loaded &&
      this.props.activeNavHoverKey === this.props.hoverKey
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        navHoverKey: 'hover-sub-0',
        loaded: true,
      });
    }
  }

  navigationOnHover = (item, index) => {
    if (!item) {
      return;
    }

    const navHoverKey = `hover-sub-${index}`;

    if (this.state.navHoverKey !== navHoverKey) {
      this.setState({ navHoverKey });
    }
  };

  render() {
    const isNavActive = this.props.activeNavHoverKey === this.props.hoverKey;
    const { subMenu } = this.props.item;
    const { theme, colorTheme } = this.props;
    return (
      <div
        className={`submenu-dropdown ${
          colorTheme === 'snowwhite' ? s.navV2 : ''
        } ${s.navDropdownList} ${isNavActive ? s.showDropdown : ''} ${
          this.props.postionRight ? s.rightNav : ''
        }`}
      >
        <div className={`${s.leftSec} ${subMenu.length > 15 ? s.col2 : ''}`}>
          {subMenu &&
            subMenu.length > 0 &&
            subMenu.map((val, index) => (
              <Link
                key={index}
                to={val.link}
                className={`${s.item}`}
                data-ga={`Navbar_${val.link}|${val.link}`}
                // onMouseOver={() => {
                //   this.navigationOnHover(val, index);
                // }}
              >
                {val.label}
              </Link>
            ))}
        </div>
        <div className={`${s.rightSec}`}>
          {subMenu &&
            subMenu.length > 0 &&
            subMenu.map((val, index) => (
              <React.Fragment key={index}>
                <div
                  key={index}
                  className={`${s.itemdata}  ${
                    this.state.navHoverKey === `hover-sub-${index}`
                      ? s.active
                      : ''
                  }`}
                >
                  <NavDropDown
                    item={val}
                    activeNavHoverKey={this.state.navHoverKey}
                    hoverKey={`hover-sub-${index}`}
                    postionRight={this.props.postionRight}
                    subItem
                    theme={val.theme || theme}
                    colorTheme={colorTheme}
                  />
                </div>
              </React.Fragment>
            ))}
        </div>
      </div>
    );
  }
}
NavDropDownList.propTypes = {
  item: PropTypes.shape({
    subMenu: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  activeNavHoverKey: PropTypes.string,
  hoverKey: PropTypes.string.isRequired,
  postionRight: PropTypes.bool,
  theme: PropTypes.string,
  colorTheme: PropTypes.string,
};

NavDropDownList.defaultProps = {
  activeNavHoverKey: '',
  postionRight: false,
  theme: '',
  colorTheme: '',
};

export default NavDropDownList;
