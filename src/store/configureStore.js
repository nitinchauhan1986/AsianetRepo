import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducerRegistry from '../reduxUtils/reducerRegistry';
// import createHelpers from './createHelpers';
// import createLogger from './logger';

export default function configureStore(initialState, helpersConfig) {
  // const helpers = createHelpers(helpersConfig);
  const helpers = helpersConfig;
  const middleware = [thunk.withExtraArgument(helpers)];

  // Preserve initial state for not-yet-loaded reducers
  const combine = reducers => {
    const reducerNames = Object.keys(reducers);
    Object.keys(initialState).forEach(item => {
      if (reducerNames.indexOf(item) === -1) {
        // eslint-disable-next-line no-param-reassign
        reducers[item] = (state = null) => state;
      }
    });
    return combineReducers(reducers);
  };

  let enhancer;

  if (__DEV__) {
    // middleware.push(createLogger());

    // https://github.com/zalmoxisus/redux-devtools-extension#redux-devtools-extension
    let devToolsExtension = f => f;
    if (process.env.BROWSER && window.devToolsExtension) {
      devToolsExtension = window.devToolsExtension();
    }

    enhancer = compose(applyMiddleware(...middleware), devToolsExtension);
  } else {
    enhancer = applyMiddleware(...middleware);
  }

  const reducer = combine(reducerRegistry.getReducers());
  // See https://github.com/reactjs/reduxUtils/releases/tag/v3.1.0
  const store = createStore(reducer, initialState, enhancer);

  // // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  // if (__DEV__ && module.hot) {
  //   module.hot.accept('../reducers', () =>
  //     // eslint-disable-next-line global-require
  //     store.replaceReducer(require('../reducers').default),
  //   );
  // }

  // Replace the store's reducer whenever a new reducer is registered.
  reducerRegistry.setChangeListener(reducers => {
    store.replaceReducer(combine(reducers));
  });

  return store;
}
