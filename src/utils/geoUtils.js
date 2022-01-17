import makeRequest from 'utils/makeRequest';
import { GEO_CITY_BY_LAT_LONG_API } from 'constants/index';

/**
 * Function to run default script of fewcent js
 */
export function getUserLocation(successCallback, errorCallBack) {
  if (
    navigator.geolocation &&
    typeof navigator.geolocation.getCurrentPosition === 'function'
  ) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallBack);
  }
}

export function getCityByLatLong(lat, long, callback) {
  const dataUrl = `${GEO_CITY_BY_LAT_LONG_API}&lat=${lat}&lng=${long}`;
  makeRequest.get(dataUrl, {}, 'skipfeedengine').then(data => {
    if (!(data && data.data && typeof data.data.item !== 'undefined')) {
      return;
    }
    callback(data.data.item, true);
  });
}
