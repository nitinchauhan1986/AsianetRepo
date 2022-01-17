// eslint-disable-next-line import/prefer-default-export
export function loadCustomScrollbar() {
  return import(/* webpackChunkName: 'perfect-scroll' */ 'perfect-scrollbar');
}
