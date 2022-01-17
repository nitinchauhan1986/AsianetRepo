function _parseCookieValue(s) {
  let tempS = s;
  if (tempS.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    tempS = tempS
      .slice(1, -1)
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
  try {
    // If we can't decode the cookie, ignore it, it's unusable.
    // Replace server-side written pluses with spaces.
    return decodeURIComponent(tempS.replace(/\+/g, ' '));
  } catch (e) {
    // console.log(e)
  }
  return undefined;
}

export function getCookie(name) {
  let result = name ? undefined : {};
  const cookies =
    typeof document !== 'undefined' && document.cookie
      ? document.cookie.split('; ')
      : [];
  for (let i = 0, l = cookies.length; i < l; i += 1) {
    const parts = cookies[i].split('=');
    const nameK = decodeURIComponent(parts.shift());
    let cookie = parts.join('=');
    cookie = _parseCookieValue(cookie);
    if (name && name === nameK) {
      result = cookie;
      break;
    }
    if (!name && cookie !== undefined) {
      result[nameK] = cookie;
    }
  }
  return result;
}

/**
 * Cookie Set,Get,Delete
 */
export function getAllCookie() {
  return getCookie();
}

/**
 * Set a cookie
 *
 * @param {String} name name of the cookie to be set
 * @param {String} value value of the cookie to be set
 * @param {Number} days number of days for which the cookie is to be set
 * @param {String} path path of the cookie to be set
 * @param {String} domain domain of the cookie to be set
 * @param {Boolean} secure true if the cookie is to be set on https only
 */
export function setCookie(name, value, days, path, domain, secure) {
  let expires = '';
  const cookieDays = days !== undefined ? days : 30;
  const date = new Date();
  date.setTime(date.getTime() + cookieDays * 24 * 60 * 60 * 1000);
  expires = `; expires=${date.toGMTString()}`;
  const cookieDomain = (domain || document.location.host).split(':')[0]; // removing port
  let cookiePath = path || document.location.pathname;
  // Removing file name, fix for IE11
  if (/\/.*\..*/.test(cookiePath)) {
    // if path contains file name
    cookiePath = cookiePath.split('/');
    cookiePath.pop();
    cookiePath = cookiePath.join('/');
  }
  document.cookie = `${name}=${value}${expires}${path ? `;path=${path}` : ''}${
    cookieDomain && cookieDomain !== 'localhost'
      ? `;domain=${cookieDomain}`
      : ''
  }${secure ? ';secure' : ''}`;
}

/**
 * Remove a cookie
 *
 * @memberOf module:cookie#
 * @function remove
 *
 * @param {String} name name of the cookie to be removed
 * @param {String} [path] path of the cookie
 * @param {String} [domain] domain of the cookie
 *
 * @example
 *
 *  require(['cookie'],function(cookie){
 *     cookie.remove("abc");
 *  });
 */
export function removeCookie(name, path, domain) {
  if (name) {
    const cookieDomain = (domain || document.location.host).split(':')[0];
    const cookiePath = path || document.location.pathname;
    setCookie(name, null, -1, cookiePath, cookieDomain);
  }
}

export default {
  get: getCookie,
  getAll: getAllCookie,
  set: setCookie,
  remove: removeCookie,
};
