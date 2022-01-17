import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';

const FooterLoadableComponent = Loadable({
  loader: () => import(/* webpackChunkName: 'footer' */ './Footer'),
  loading: () => null,
  // delay: 2000,
});
const EtimesFooterLoadableComponent = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'footer' */ '../EtimesFooter/Footer'),
  loading: () => null,
  // delay: 2000,
});

export default class WithFooter extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    if (this.props.headerType && this.props.headerType === 'Etimes') {
      return <EtimesFooterLoadableComponent {...this.props} />;
    }
    return <FooterLoadableComponent {...this.props} />;
  }
}
WithFooter.propTypes = {
  headerType: PropTypes.string,
};
WithFooter.defaultProps = {
  headerType: '',
};
