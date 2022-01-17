import React from 'react'; // get the React object from the react module
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadDataList } from './redux';
import ListView from '../../components/ListView';

class DynaView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    this.props.loadDataList(this.props);
  }
  _DynaComponent = dataset => <ListView data={dataset} params={this.props} />;
  render() {
    return (
      <>
        {this.props.dataList.length > 0 &&
          this._DynaComponent(this.props.dataList)}
      </>
    );
  }
}
DynaView.propTypes = {
  loadDataList: PropTypes.func.isRequired,
  dataList: PropTypes.shape({
    length: PropTypes.func,
  }),
};

DynaView.defaultProps = {
  dataList: PropTypes.shape({
    length: PropTypes.func,
  }),
};

const mapStateToProps = state => ({
  dataList: state.dataList.dataList || state.dataList,
  navigation: state.navigation,
  dataReceived: state.dataReceived,
});

const mapDispatchToProps = dispatch => ({
  loadDataList: params => {
    dispatch(loadDataList(params));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DynaView);
