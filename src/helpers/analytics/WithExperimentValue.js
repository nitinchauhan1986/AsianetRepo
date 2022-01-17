import React from 'react';
import PropTypes from 'prop-types';
// import { gtag } from 'utils/common';

class WithExperimentValue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  setExperimentCallback = value => {
    this.setExperimentValue(value);
  };
  setExperimentValue(experimentValue) {
    this.setState({
      experimentValue: parseInt(experimentValue, 10),
      experimentDone: true,
    });
  }
  static isOptimizeReady() {
    return (
      window.google_optimize && typeof window.google_optimize.get === 'function'
    );
  }
  getQueryParams = params => {
    const { href = '' } = window.location;
    const reg = new RegExp(`[?&]${params}=([^&#]*)`, 'i');
    const queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
  };
  getExperimentValue() {
    const { experimentId } = this.props;
    const queryParam = this.getQueryParams('experiment'); //for testing purpose
    if (queryParam != null) return queryParam;
    return window.google_optimize.get(experimentId);
  }
  startExperiment() {
    const experimentValue = this.getExperimentValue();
    this.setExperimentValue(experimentValue);
  }
  componentDidMount() {
    // const { experimentId } = this.props;
    if (WithExperimentValue.isOptimizeReady()) {
      this.startExperiment();
    } else {
      this.timer = setInterval(() => {
        if (WithExperimentValue.isOptimizeReady()) {
          this.startExperiment();
          clearInterval(this.timer);
        }
      }, 1000);
      // gtag('event', 'optimize.callback', {
      //   name: experimentId,
      //   callback: this.setExperimentCallback,
      // });
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const { experimentValue } = this.state;
    if (this.state.experimentDone && typeof this.props.render === 'function') {
      const myComponent = this.props.render({ experimentValue }) || null;
      return myComponent;
    }
    return null;
  }
}
WithExperimentValue.propTypes = {
  render: PropTypes.func.isRequired,
  experimentId: PropTypes.string,
};
WithExperimentValue.defaultProps = {
  experimentId: undefined,
};
export default WithExperimentValue;
