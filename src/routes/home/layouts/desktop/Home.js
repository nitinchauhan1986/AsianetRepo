import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import s from '../../../../styles/main.scss';
// import Header from '../../components/desktop/Header';

class Home extends React.Component {
  render() {
    return (
      <div className="contentwrapper">
        <div className={s.header}>
          <div className={s.abc}>Header</div>
        </div>
        <div className={s.body}>
          <div className={s.left}>Left </div>
          <div className={s.right}>right</div>
        </div>
        <div className={s.abc}>Footer</div>
      </div>
    );
  }
}

const mapDispatchtoProps = (dispatch) => ({});

const mapStateToProps = (state) => ({});

Home.propTypes = {};
Home.defaultProps = {};

export default connect(mapStateToProps, mapDispatchtoProps)(Home);

Home.contextTypes = {
  store: PropTypes.object.isRequired,
};
