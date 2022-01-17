import { TOI_LIVE_DOMAIN } from '../constants';

export function getSiteDomainName() {
  return `${TOI_LIVE_DOMAIN}/`;
}

export function videoIframeTemplate() {
  return 'vod_player_react.cms';
}

export function miniTVIframeTemplate() {
  return 'minitv_v2.cms';
}

const connectedDomains = ['zigwheels.com', 'mediawire.in'];
export function isConnectedDomain(url) {
  if (typeof url !== 'string') {
    return false;
  }
  let isConnectedDomainValue = false;
  connectedDomains.forEach(domainName => {
    if (url.indexOf(domainName) >= 0) {
      isConnectedDomainValue = true;
    }
  });
  return isConnectedDomainValue;
}
