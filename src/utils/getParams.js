import { getSiteDomain } from 'utils/common';
/* eslint-disable func-names */
export const getCurrentPage = function(query) {
  if (typeof query !== 'object' || !parseInt(query.curpg, 10)) {
    return 1;
  }
  return parseInt(query.curpg, 10);
};

const FRMPAPP = 'frmapp';
const FRMWAP = 'frmwap';
/**
 * Checking the mentioned Key value pair
 * @param {*} query : query object
 * @param {*} params : parameter to be checked in the query object
 */
function checkValue(query, params) {
  if (typeof query !== 'object') {
    return false;
  }
  return query[params] === 'yes';
}

/**
 * Checking whether request is from APP.
 * @param {*} query
 */
export const isApp = function(query) {
  return checkValue(query, FRMPAPP);
};

/**
 * Checking whether request from WAP.
 * @param {*} query
 */
export const isWap = function(query) {
  return checkValue(query, FRMWAP);
};

export const generatePrevNextPageURLforBot = (context, data) => {
  const domain = getSiteDomain();
  let pageUrlArray = {};
  const urlArrayObject = [];

  const curPageNumber = getCurrentPage(context.query);

  const isNextPageAvailabe = curPageNumber * 20 < parseInt(data.oldCount, 10);

  if (typeof curPageNumber === 'number' && data.params) {
    if (curPageNumber === 1 && isNextPageAvailabe) {
      pageUrlArray = {
        key: 'next',
        url: `${domain}${data.params.fullPath}?curpg=2`,
      };
      urlArrayObject.push(pageUrlArray);
    } else if (curPageNumber > 1) {
      pageUrlArray = {
        key: 'prev',
        url: `${domain}${data.params.fullPath}?curpg=${curPageNumber - 1}`,
      };
      urlArrayObject.push(pageUrlArray);
      if (isNextPageAvailabe) {
        pageUrlArray = {
          key: 'next',
          url: `${domain}${data.params.fullPath}?curpg=${curPageNumber + 1}`,
        };
        urlArrayObject.push(pageUrlArray);
      }
    }
  }
  return urlArrayObject;
};
