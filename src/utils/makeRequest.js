import axios from 'axios';
import { getExternalFeedUrl } from 'helpers/feeds/generalHelpers';
import { getSiteDomain } from '../utils/common';

export default class makeRequest {
  constructor(obj) {
    return axios(obj);
  }

  static appendDomainToUrl(url, params) {
    let isRelativeUrl;
    const endpointData = [];

    const domain = getSiteDomain();

    if (url && typeof url === 'string') {
      isRelativeUrl = url.indexOf('http') === -1 && url.indexOf('.com') === -1;
    }
    if (isRelativeUrl) {
      if (params[2] !== 'skipfeedengine') {
        endpointData.push(getExternalFeedUrl());
      }
      if (url[0] === '/') {
        endpointData.push(domain);
      } else {
        endpointData.push(domain);
        endpointData.push('/');
      }
    }
    endpointData.push(url);
    return endpointData.join('');
  }

  static get() {
    const params = Object.assign([], arguments);
    params[0] = makeRequest.appendDomainToUrl(params[0], params);
    //@todo can we use __PROD__ for this rather than params[0] ?
    if (
      params[0].includes('toifeeds') ||
      params[0].includes('pwastg') ||
      params[0].includes('localhost')
    ) {
      // if (global.upcache) {
      //   params[0] += '&upcache=2';
      // }
      //@todo from it's getting set ? do we have to check this in all the request ?
      if (global.isMobileUserAgent) {
        params[0] += '&ismobile=true';
      }
    }
    return axios.get.apply(null, params);
  }

  static getwap() {
    const params = Object.assign([], arguments);
    params[0] = makeRequest.appendDomainToUrl(params[0], params);
    return axios.get.apply(null, params);
  }

  static post() {
    const params = Object.assign([], arguments);
    params[0] = makeRequest.appendDomainToUrl(params[0]);
    return axios.post.apply(null, params);
  }
}
