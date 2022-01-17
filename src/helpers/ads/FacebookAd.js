import React from 'react';
import PropTypes from 'prop-types';

function attachFacebookAds({
  fanConatainerRef = {},
  placementId,
  size,
  errorCallback,
}) {
  const testmode = window.location.href.indexOf('fan_testing') >= 0;
  // const loggingEnabled = window.location.href.indexOf('logging_enabled') >= 0;
  // const testmode = true;
  const loggingEnabled = true;
  const adDomElement = fanConatainerRef.current;
  if (!adDomElement) {
    return;
  }
  window.ADNW = window.ADNW || {};
  window.ADNW.v60 = window.ADNW.v60 || {};
  window.ADNW.v60.slots = window.ADNW.v60.slots || [];
  window.ADNW.v60.slots.push({
    rootElement: adDomElement,
    placementid: placementId,
    format: size,
    testmode,
    onAdLoaded: (/*rootElement*/) => {
      if (loggingEnabled) {
        console.log('Audience Network [[PLACEMENT_ID]] ad loaded');
      }

      //rootElement.style.display = 'block';
    },
    onAdError: (errorCode, errorMessage) => {
      if (loggingEnabled) {
        console.log(
          `Audience Network [[PLACEMENT_ID]] error (${errorCode}) ${errorMessage}`,
        );
      }
      if (typeof errorCallback === 'function') {
        errorCallback();
      }
    },
  });
}

class FacebookAd extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.divRef = React.createRef();
  }
  componentDidMount() {
    const { placementId, size, errorCallback } = this.props;

    attachFacebookAds({
      fanConatainerRef: this.divRef,
      placementId,
      size,
      errorCallback,
    });
  }
  render() {
    const { className } = this.props;
    return <div ref={this.divRef} className={className} />;
  }
}

FacebookAd.propTypes = {
  placementId: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  errorCallback: PropTypes.func,
  className: PropTypes.string,
};
FacebookAd.defaultProps = {
  errorCallback: undefined,
  className: undefined,
};
export default FacebookAd;
