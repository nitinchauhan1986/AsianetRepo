import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import makeRequest from 'utils/makeRequest';
import LoaderSpinner from 'components_v2/common/LoaderSpinner';
import s from './NavDropDown.scss';

const DropDown = React.lazy(() => import('./DropDown'));
const DropDownV2 = React.lazy(() => import('./DropDownV2'));

class NavDropDown extends React.Component {
  constructor() {
    super();
    this.state = {
      dataFetchCall: false,
      dataLoaded: false,
    };
  }

  componentDidUpdate() {
    if (
      !this.state.dataFetchCall &&
      this.props.activeNavHoverKey === this.props.hoverKey
    ) {
      this.fetchData();
    }
  }

  fetchData() {
    this.setState({ dataFetchCall: true });
    if (this.props.item && this.props.item.wu) {
      makeRequest.get(this.props.item.wu, {}, 'skipfeedengine').then(data => {
        if (data && data.status === 200 && data.data) {
          this.setState({ data: data.data, dataLoaded: true });
        }
      });
    }
  }

  render() {
    const isNavActive = this.props.activeNavHoverKey === this.props.hoverKey;
    const { theme, item } = this.props;
    const type = theme === 'video' ? theme : this.props?.item?.type || 'list';
    return (
      <div
        className={`${s.navDropdown} ${
          this.props.colorTheme === 'snowwhite' ? s.navV2 : ''
        } ${isNavActive ? s.showDropdown : ''}  ${
          this.props.postionRight ? s.rightNav : ''
        } ${this.props.subItem ? s.subitem : 'submenu-dropdown'}`}
      >
        {isNavActive &&
          (this.props.item && this.props.item.wu && !this.state.dataLoaded) && (
            <LoaderSpinner />
          )}
        <Suspense fallback={<div />}>
          {theme === 'col' || theme === 'video' ? (
            <DropDownV2
              data={this.state.data}
              subItem={this.props.subItem}
              type={type}
              newga={item && item.link ? `Navbar_${item.link}` : ''}
            />
          ) : (
            <DropDown
              data={this.state.data}
              subItem={this.props.subItem}
              type={
                this.props.item && this.props.item.type
                  ? this.props.item.type
                  : 'list'
              }
              newga={item && item.link ? `Navbar_${item.link}` : ''}
            />
          )}
        </Suspense>
      </div>
    );
  }
}
NavDropDown.propTypes = {
  item: PropTypes.shape({
    wu: PropTypes.string.isRequired,
    type: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  activeNavHoverKey: PropTypes.string,
  hoverKey: PropTypes.string.isRequired,
  postionRight: PropTypes.bool,
  subItem: PropTypes.bool,
  theme: PropTypes.string,
  colorTheme: PropTypes.string,
};

NavDropDown.defaultProps = {
  activeNavHoverKey: '',
  postionRight: false,
  subItem: false,
  theme: '',
  colorTheme: '',
};

export default NavDropDown;
