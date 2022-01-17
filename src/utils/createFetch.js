/* @flow */

// type Fetch = (url: string, options: ?any) => Promise<any>;

// type Options = {
//   baseUrl: string,
//   cookie?: string,
// };

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
// function createFetch(fetch: Fetch, { baseUrl, cookie }: Options) {
function createFetch(fetch) {
  // NOTE: Tweak the default options to suite your application needs
  // const defaults = {
  //   method: 'GET',
  //   mode: baseUrl ? 'cors' : 'same-origin',
  //   headers: {
  //     ...(cookie ? { Cookie: cookie } : null),
  //   },
  // };

  return async (url, options) => fetch(url, options);
}

export default createFetch;
