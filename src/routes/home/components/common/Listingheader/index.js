import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import WithWeather from 'modules/WithWeather';
/* import makeRequest from '../../../../utils/makeRequest'; */
import Link from 'components/Link';
import s from './Listingheader.scss';

class Listingheader extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  getHeadingHtml = text => {
    if (typeof text === 'string' && text.toLowerCase().indexOf('toi+') > -1) {
      const toiPlusIndex = text.toLowerCase().indexOf('toi+');
      const headingHTML = [];
      headingHTML.push(text.substring(0, toiPlusIndex));
      headingHTML.push(<span className={s.toi_plus} />);
      headingHTML.push(text.substring(toiPlusIndex + 4, text.length));
      return headingHTML;
    }
    return text;
  };

  render() {
    const { isWhiteTheme, size, linkData, overrideClass } = this.props;
    const listingClassName = classNames({
      [s.header]: true,
      [s.themewhite]: isWhiteTheme,
      [s[size]]: size,
      [s.loading]: this.props.loading,
      [`${overrideClass}`]: overrideClass,
    });
    //const DropdownComp = this.props.dropdownComp;
    return (
      <React.Fragment>
        <div className={listingClassName}>
          {this.props.headingname && (
            <React.Fragment>
              {this.props.headingLink ? (
                <h2 className={`${s.heading}`}>
                  <Link
                    className={`${s.linkarrow}`}
                    to={this.props.headingLink}
                    data={linkData}
                    data-newga={this.props.newga}
                  >
                    {this.getHeadingHtml(this.props.headingname)}
                  </Link>
                </h2>
              ) : (
                <h2 className={s.heading}>
                  {' '}
                  {this.getHeadingHtml(this.props.headingname)}{' '}
                </h2>
              )}
            </React.Fragment>
          )}
          <React.Fragment />

          {this.props.cityDropdown && (
            <div className={s.changecity} onClick={this.openDropDown}>
              Change
            </div>
          )}
          {/* {this.props.showWeather && <WithWeather />} */}
          {React.isValidElement(this.props.children) && this.props.children}
        </div>
      </React.Fragment>
    );
  }
}
Listingheader.propTypes = {
  headingname: PropTypes.string,
  isWhiteTheme: PropTypes.bool,
  // showWeather: PropTypes.bool,
  cityDropdown: PropTypes.bool,
  children: PropTypes.element,
  headingLink: PropTypes.string,
  size: PropTypes.string,
  linkData: PropTypes.shape({}),
  newga: PropTypes.string,
  loading: PropTypes.bool,
  overrideClass: PropTypes.string,
};
Listingheader.defaultProps = {
  headingname: undefined,
  isWhiteTheme: false,
  // showWeather: false,
  cityDropdown: false,
  children: undefined,
  headingLink: '',
  size: '',
  linkData: undefined,
  newga: '',
  loading: undefined,
  overrideClass: '',
};

export default Listingheader;
