import React from 'react';
import PropTypes from 'prop-types';

class WithGeo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static isGeoInfoPresent() {
    return window.geoinfo && typeof window.geoinfo.CountryCode === 'string';
  }
  static getParameterByName(name, url) {
    // eslint-disable-next-line no-param-reassign
    if (!url) url = window.location.href;
    // eslint-disable-next-line no-param-reassign
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  componentDidMount() {
    const countryPassedFromUrl = WithGeo.getParameterByName('country_testing');
    if (WithGeo.isGeoInfoPresent()) {
      this.setState({
        geoCountry: countryPassedFromUrl || window.geoinfo.CountryCode,
        geoContinent: window.geoinfo.Continent,
      });
    } else {
      this.timer = setInterval(() => {
        if (WithGeo.isGeoInfoPresent()) {
          this.setState({
            geoCountry: countryPassedFromUrl || window.geoinfo.CountryCode,
            geoContinent: window.geoinfo.Continent,
          });
          clearInterval(this.timer);
        }
      }, 1000);
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const { geoCountry, geoContinent } = this.state;
    if (
      typeof this.state.geoCountry === 'string' &&
      typeof this.state.geoContinent === 'string' &&
      typeof this.props.render === 'function'
    ) {
      return this.props.render({ geoCountry, geoContinent }) || null;
    }
    return null;
  }
}
WithGeo.propTypes = {
  render: PropTypes.func.isRequired,
};
export default WithGeo;
