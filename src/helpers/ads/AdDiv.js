import React from 'react';
import PropTypes from 'prop-types';

class AdDiv extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      adCode: PropTypes.string,
      size: PropTypes.array,
      divId: PropTypes.string,
    }).isRequired,
    addToQueue: PropTypes.func.isRequired,
    deviceType: PropTypes.string,
    className: PropTypes.string,
    callback: PropTypes.func,
    adsCounter: PropTypes.number,
    prebid: PropTypes.bool,
    lazyload: PropTypes.bool,
    dfpParams: PropTypes.shape({}),
    'data-videoarticle': PropTypes.number,
  };
  static defaultProps = {
    deviceType: '',
    className: '',
    callback: undefined,
    prebid: false,
    adsCounter: undefined,
    lazyload: false,
    dfpParams: undefined,
    'data-videoarticle': undefined,
  };

  constructor(props) {
    super(props);
    const { adsCounter = 1 } = props;
    const { divId = parseInt(Math.random() * 10e9, 10) } = props.data;
    const newAdObject = {
      ...props.data,
      deviceType: props.deviceType,
      divId: `${divId}-${adsCounter}`,
      callback: props.callback,
      prebid: props.prebid,
      dfpParams: props.dfpParams,
    };
    this.isRandomGenenratedDivPresent =
      typeof props.data.divId !== 'string' && !props.lazyload;
    this.state = {
      newAdObject,
      shouldAttachDivId: !this.isRandomGenenratedDivPresent,
    };
  }
  componentDidMount() {
    if (this.props.addToQueue && this.props.data) {
      this.props.addToQueue({ ...this.state.newAdObject });
    }
    if (!this.state.shouldAttachDivId) {
      this.setState({
        shouldAttachDivId: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.data &&
      prevProps.data.adCode &&
      this.props.data &&
      this.props.data.adCode &&
      this.props.data.adCode !== prevProps.data.adCode
    ) {
      const { divId = parseInt(Math.random() * 10e9, 10) } = this.props.data;
      const { adsCounter = 1 } = this.props;
      const newAdObject = {
        ...this.state.newAdObject,
        ...this.props.data,
        divId: `${divId}-${adsCounter}`,
      };

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ newAdObject }, () => {
        if (this.props.addToQueue && this.props.data) {
          this.props.addToQueue({ ...this.state.newAdObject });
        }
      });
    }
  }

  render() {
    if (this.state.newAdObject) {
      const { adCode, divId } = this.state.newAdObject;

      if (adCode) {
        return (
          <div
            id={this.state.shouldAttachDivId ? divId : undefined}
            className={this.props.className}
            data-videoarticle={this.props['data-videoarticle']}
          />
        );
      }
      return null;
    }
    return null;
  }
}
export default AdDiv;
