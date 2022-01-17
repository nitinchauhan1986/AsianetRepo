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

  render() {
    const {
      isWhiteTheme,
      size,
      linkData,
      overrideClass,
      doNotChangeURL,
      subheading,
      target,
    } = this.props;
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
          {this.props.headingLink ? (
            <h2 className={`${s.heading}`}>
              <Link
                className={`${s.linkarrow} ${subheading ? s.arrowalign : ''}`}
                to={this.props.headingLink}
                data={linkData}
                data-newga={this.props.newga}
                doNotChangeURL={doNotChangeURL}
                target={target === '_blank' ? target : ''}
              >
                {this.props.headingname}
                {subheading && (
                  <span className={s.subheading}>{subheading}</span>
                )}
              </Link>
            </h2>
          ) : (
            <h2 className={s.heading}>
              {' '}
              {this.props.headingname}{' '}
              {subheading && <span className={s.subheading}>{subheading}</span>}{' '}
            </h2>
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
  subheading: PropTypes.string,
  isWhiteTheme: PropTypes.bool,
  // showWeather: PropTypes.bool,
  children: PropTypes.element,
  headingLink: PropTypes.string,
  size: PropTypes.string,
  linkData: PropTypes.shape({}),
  newga: PropTypes.string,
  loading: PropTypes.bool,
  overrideClass: PropTypes.string,
  doNotChangeURL: PropTypes.bool,
};
Listingheader.defaultProps = {
  headingname: undefined,
  subheading: '',
  isWhiteTheme: false,
  // showWeather: false,
  children: undefined,
  headingLink: '',
  size: '',
  linkData: undefined,
  newga: '',
  loading: undefined,
  overrideClass: '',
  doNotChangeURL: false,
};

export default Listingheader;
