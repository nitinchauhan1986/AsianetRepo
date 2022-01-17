/* eslint-disable global-require */
function findTemplate(context, state) {
  return {
    Pagetype: () => (state.isMobile ? 'mobile' : 'desktop'),
  };
}

function getRoutes(templateMapping, globalContext, initialState) {
  // The top-level (parent) route
  const routes = {
    path: '',

    // Keep in mind, routes are evaluated in order
    children: [
      // The home route is added to client.js to make sure shared components are
      // added to client.js as well and not repeated in individual each route chunk.
      {
        path: '', // redirect to liveblog as home not available.
        load: () =>
          import(
            /* webpackChunkName: 'home[request]' */ `./home/layouts/${templateMapping.Pagetype()}`
          ),
      },
      // {
      //   path: '(.*)/articleshow/:msid.cms',
      //   load: () => {
      //     if (initialState.isArticleshowV2) {
      //       return import(/* webpackChunkName: 'articleshow_v2_[request]' */ `./articleshow_v2/layouts/${templateMapping.Articleshow_v2()}`);
      //     }

      //     // return import(/* webpackChunkName: 'articleshow' */ './articleshow');
      //     return import(/* webpackChunkName: 'articleshow_[request]' */ `./articleshow/layouts/${templateMapping.Articleshow()}`);
      //   },
      // },

      // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
      {
        path: '(.*)',
        load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
      },
    ],

    async action({ next }) {
      // Execute each child route until one of them return the result
      const route = await next();

      // Provide default values for title, description etc.
      route.title = `${route.title || ''}`;
      route.description = route.description || 'News , AsiaNetNews';

      return route;
    },
  };

  return routes;
}

function routesNodes(globalContext, initialState) {
  const templateMapping = findTemplate(globalContext, initialState);
  const routes = getRoutes(templateMapping, globalContext, initialState);

  // The error page is available by permanent url for development mode
  if (__DEV__) {
    routes.children.unshift({
      path: '/error',
      action: require('./error').default,
    });
  }

  return routes;
}

export default routesNodes;
