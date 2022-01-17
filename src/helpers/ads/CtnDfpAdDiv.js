import React from 'react';
import PropTypes from 'prop-types';
import CtnAdDiv from './CtnAdDiv';

class CtnDfpAdDiv extends React.Component {
  constructor() {
    super();
    this.loaded = true;
  }
  candfpAdhandler = event => {
    this.loaded = false;
    this.props.addToQueue(event.adObject);
  };

  componentDidMount() {
    window.addEventListener('CAN_DFP', this.candfpAdhandler);
  }
  componentWillUnmount() {
    window.removeEventListener('CAN_DFP', this.candfpAdhandler);
  }
  componentDidUpdate() {
    if (
      this.props.adsQueueData &&
      this.props.adsQueueData.length &&
      !this.loaded
    ) {
      const { adsQueueData } = this.props;
      for (let i = 0; i < adsQueueData.length; i += 1) {
        if (
          adsQueueData[i].targetingInfo &&
          adsQueueData[i].targetingInfo.dfpCanAd
        ) {
          const path =
            (this.props.navigation &&
              this.props.navigation.data &&
              this.props.navigation.data.path) ||
            '';
          console.log('event *************************!!!!!!!!!!!!!!!!!!!!!!!');
          this.props.loadAllAdsFromQueue('', path);
          this.loaded = true;
        }
      }
    }
  }

  render() {
    const { props } = this;
    const { lazyload, isCTN, data } = props;
    if (isCTN && !lazyload) {
      return <CtnAdDiv {...props} data={{ ...data }} />;
    }
    return null;
  }
}

CtnDfpAdDiv.propTypes = {
  data: PropTypes.shape({
    adCode: PropTypes.number.isRequired,
    msid: PropTypes.string.isRequired,
    divId: PropTypes.string,
    breadCrumb: PropTypes.string.isRequired,
  }).isRequired,
};

export default CtnDfpAdDiv;
