const webvitals = {
  webVitalsPkgURL: 'https://unpkg.com/web-vitals@1.1.1/dist/web-vitals.umd.js',
  loadDynamicJS(file) {
    const jsElm = window.document.createElement('script');
    jsElm.type = 'application/javascript';
    jsElm.src = file;
    window.document.body.appendChild(jsElm);
  },
  sendToGoogleAnalytics({ name, delta }) {
    // Assumes the global `ga()` function exists, see:
    // https://developers.google.com/analytics/devguides/collection/analyticsjs
    window.ga('send', 'event', {
      eventCategory: 'Web_Vitals',
      eventAction: name,
      // The `id` value will be unique to the current page load. When sending
      // multiple values from the same page (e.g. for CLS), Google Analytics can
      // compute a total by grouping on this ID (note: requires `eventLabel` to
      // be a dimension in your report).
      eventLabel: `${Math.round(name === 'CLS' ? delta * 1000 : delta)}_${
        window.location.href
      }_${
        window.navigator &&
        window.navigator.connection &&
        window.navigator.connection.effectiveType
          ? window.navigator.connection.effectiveType
          : 'NA'
      }`,
      // Google Analytics metrics must be integers, so the value is rounded.
      // For CLS the value is first multiplied by 1000 for greater precision
      // (note: increase the multiplier for greater precision if needed).

      // Use a non-interaction event to avoid affecting bounce rate.
      nonInteraction: true,
    });
  },
  logClsToGA() {
    if (typeof window.webVitals !== 'undefined') {
      window.webVitals.getCLS(this.sendToGoogleAnalytics);
    }
  },
  logLcpToGA() {
    if (typeof window.webVitals !== 'undefined') {
      window.webVitals.getLCP(this.sendToGoogleAnalytics);
    }
  },
  logFidToGA() {
    if (typeof window.webVitals !== 'undefined') {
      window.webVitals.getFID(this.sendToGoogleAnalytics);
    }
  },
  loadScript() {
    this.loadDynamicJS(this.webVitalsPkgURL);
  },
};
export default webvitals;
