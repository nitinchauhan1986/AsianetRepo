import React from 'react';
import PropTypes from 'prop-types';

export default class WithDelay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ mounted: true });
    }, parseInt(this.props.delay, 10));
  }
  render() {
    if (this.state.mounted || this.props.immediate) {
      return this.props.children;
    }
    return null;
  }
}
WithDelay.propTypes = {
  children: PropTypes.element,
  delay: PropTypes.number,
  immediate: PropTypes.bool,
};
WithDelay.defaultProps = {
  children: null,
  delay: 0,
  immediate: false,
};
