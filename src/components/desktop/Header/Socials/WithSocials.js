import React from 'react';
import Loadable from 'react-loadable';

const LoadableComponent = Loadable({
  loader: () => import(/* webpackChunkName: 'Socials' */ './Socials'),
  loading: () => null,
});

export default class WithSocials extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ load: true });
    }, 1000);
  }
  render() {
    if (!this.state.load) {
      return null;
    }
    return <LoadableComponent {...this.props} />;
  }
}
