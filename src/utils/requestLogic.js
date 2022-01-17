import isMobile from './isMobile';

const isAkamaiMobile = headers => {
  let mobileDevice = false;
  // if (headers.host === 'vsp1toispa.timesofindia.com') {
  //   mobileDevice = true;
  // } else if (headers.host === 'vsp1toispa.indiatimes.com') {
  //   mobileDevice = false;
  // } else {
  mobileDevice = isMobile(headers['user-agent']);
  if (headers.host === 'vsp1toispa.timesofindia.com') {
    mobileDevice = true;
  }
  // }
  return mobileDevice;
};

export default function getRequestMappings({
  headers,
  query,
  isVersion2,
  isIframe,
  utmBasedCache,
}) {
  const isWapPage =
    (isAkamaiMobile(headers) || query.frmwap === 'yes') &&
    query.frmweb !== 'yes';
  const wapPageKey = isWapPage ? '-wap' : '';
  const curpgKey = query.curpg ? `curpg-${query.curpg}` : '';
  const isPrime =
    query.frmprime === 'yes' ||
    query.pc === 'yes' ||
    (headers ? headers.primetemplate === '1' : false);
  const primePageKey = isPrime ? '-prime' : '';
  const appKey = query.frmapp === 'yes' ? '-app' : '';
  const newVersionKey =
    ['lbv2', 'newpc'].indexOf(query.utm) > -1 || isVersion2 ? '-v2' : '';
  const isFrmapp = query.frmapp === 'yes';
  const geoclKey = query.geocl ? `-geocl-${query.geocl}` : '';
  const geolocationKey = query.geolocation
    ? `-geoloc-${query.geolocation}`
    : '';
  let iframeKeys = '';
  if (isIframe) {
    const queryKeys = Object.keys(query) || [];
    for (let i = 0; i < queryKeys.length; i += 1) {
      iframeKeys += `-${queryKeys[i]}-${query[queryKeys[i]]}-`;
    }
  }
  const envKey = query.env ? `-env-${query.env}` : '';
  const utmKey = (() => {
    let value = '';
    if (utmBasedCache) {
      value += query.utm_source ? `-utmsource_${query.utm_source}` : '';
      value += query.utm_medium ? `-utmmedium_${query.utm_medium}` : '';
      value += query.utm_campaign ? `-utmcampaign_${query.utm_campaign}` : '';
    }

    return value;
  })();

  return {
    redisSubKey: `${primePageKey}${wapPageKey}${appKey}${curpgKey}${newVersionKey}${geoclKey}${geolocationKey}${iframeKeys}${envKey}${utmKey}`,
    isPrime,
    isWapPage,
    isFrmapp,
  };
}
