function loadAdsenseScript() {
  const adsenseScript = document.createElement('script');
  adsenseScript.type = 'text/javascript';
  adsenseScript.async = true;
  adsenseScript.src =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  adsenseScript.setAttribute('data-ad-client', 'ca-pub-1902173858658913');
  const node = document.getElementsByTagName('script')[0];
  node.parentNode.insertBefore(adsenseScript, node);
}

export default loadAdsenseScript;
