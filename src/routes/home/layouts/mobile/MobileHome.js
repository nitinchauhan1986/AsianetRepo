import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
class MobileHome extends React.Component {
  render() {
    return <div>Hello Mobile</div>;
  }
}

export default MobileHome;

MobileHome.contextTypes = {
  store: PropTypes.object.isRequired,
};
