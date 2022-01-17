import React from 'react';
import { connect } from 'react-redux';
import FacebookAd from 'helpers/ads/FacebookAd';
import PropTypes from 'prop-types';
// import WithGeo from 'helpers/ads/WithGeo';

class WithFanAd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fallback: false,
      key: 1,
    };
  }
  componentDidMount() {
    // const isTestingMode = true;

    // refresh fan ad code
    if (this.props.refreshTime && !this.state.fallback) {
      this.fanAdRefreshInterval = setInterval(() => {
        this.setState({ key: this.state.key + 1 }); // remountig the child component
      }, this.props.refreshTime);
    }
  }
  componentWillUnmount() {
    clearInterval(this.fanAdRefreshInterval);
  }
  render() {
    const { fanAdData = {}, siteConfig } = this.props;
    if (this.state.fallback || !siteConfig || siteConfig.fanAd === '0') {
      return React.isValidElement(this.props.fallback) && this.props.fallback;
    }

    return (
      <FacebookAd
        key={this.state.key}
        {...fanAdData}
        errorCallback={() => {
          // load DfpAds here
          clearInterval(this.fanAdRefreshInterval);
          this.setState({
            fallback: true,
          });
        }}
      />
    );
  }
}

WithFanAd.propTypes = {
  fallback: PropTypes.element,
  fanAdData: PropTypes.shape({}).isRequired,
  refreshTime: PropTypes.number,
  siteConfig: PropTypes.shape({}),
};
WithFanAd.defaultProps = {
  fallback: null,
  refreshTime: undefined,
  siteConfig: {},
};
const mapStateToProps = state => ({
  isPrime: state.isPrime,
  siteConfig: state.common.siteConfig,
});

export default connect(mapStateToProps)(WithFanAd);
