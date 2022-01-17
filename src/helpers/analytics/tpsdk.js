import { LOGIN_MAPPED_ON_LIVE } from 'constants/index';

export default {
  __html: `(function(g, r, o, w, t, h, rx) {
        g[t] =
          g[t] ||
          function() {
            (g[t].q = g[t].q || []).push(arguments);
          };
        g[t].l = 1 * new Date();
        g[t] = g[t] || {};
        h = r.createElement(o);
        rx = r.getElementsByTagName(o)[0];
        h.async = 1;
        h.src = w;
        rx.parentNode.insertBefore(h, rx);
      })(
        window,
        document,
        'script',
        'https://${
          !(LOGIN_MAPPED_ON_LIVE || __PROD__)
            ? 'test-img.timespoints.com'
            : 'image.timespoints.iimg.in'
        }/static/tpsdk/tp-sdk.js',
        'tpsdk',
      );`,
};
