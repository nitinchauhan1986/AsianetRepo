import analyticsWrapper from 'helpers/analytics/analyticsWrapper';

export default ({ category = 'default', action = 'action', label }) => {
  let actualCategory = category;
  let actualAction = action;
  let actualLabel = label;
  return (target, key, descriptor) => {
    const fn = descriptor.value;
    // console.log('yo starting ',key)
    // create a new function that sandwiches
    // the call to our original function between
    // two logging statements
    const newFn = function newFn(...args) {
      if (typeof ga === 'function') {
        if (typeof args === 'object' && args[0] && args[0].target) {
          const getGACategoryAttribute =
            args[0].target.getAttribute('data-setgacategory') ||
            args[0].currentTarget.getAttribute('data-setgacategory');
          // console.log(getGACategoryAttribute);
          if (
            args[0].target.getAttribute('data-ga') ||
            args[0].currentTarget.getAttribute('data-ga')
          ) {
            const targetArr = (
              args[0].target.getAttribute('data-ga') ||
              args[0].currentTarget.getAttribute('data-ga')
            ).split('|');

            if (
              (typeof getGACategoryAttribute === 'string' &&
                getGACategoryAttribute.length > 0) ||
              targetArr.length === 3
            ) {
              actualCategory = targetArr[0] || actualCategory;
              actualAction = targetArr[1] || actualAction;
              actualLabel = targetArr[2] || actualLabel;
            } else {
              if (window && window.categoryForGA) {
                actualCategory = `${window.categoryForGA}`;
              } else {
                actualCategory = `WEB-${window.location.href}`;
              }
              if (targetArr.length > 0) {
                actualAction = targetArr[0] || actualAction;
                actualLabel = targetArr[1] || actualLabel;
              }
            }
          } else if (typeof args[0].target.getAttribute('pg') === 'string') {
            const gaString = args[0].target.getAttribute('pg');
            actualCategory = gaString.split('#')[0];
            actualAction = gaString.substring(
              gaString.lastIndexOf('#') + 1,
              gaString.lastIndexOf('~'),
            );
            actualLabel = gaString.split('~')[1];
          } else if (
            typeof args[0].currentTarget.getAttribute('data-newga') === 'string'
          ) {
            const gaString = args[0].currentTarget.getAttribute('data-newga');
            if (
              typeof getGACategoryAttribute === 'string' &&
              getGACategoryAttribute.length > 0
            ) {
              actualCategory = gaString.split('#')[0];
              actualAction = gaString.split('#')[1];
              actualLabel = gaString.split('#')[2];
            } else {
              if (window && window.categoryForGA) {
                actualCategory = `${window.categoryForGA}`;
              } else {
                actualCategory = `WEB-${window.location.href}`;
              }
              const gaData = gaString.split('#');
              actualAction = gaData[0];
              actualLabel = gaData[1];
              if (gaData[2]) {
                actualCategory = gaData[2].split('/')[0];
              }
            }
          }
        }
        if (typeof actualLabel !== 'string') {
          actualLabel = window.location.href;
        } else if (
          typeof actualLabel === 'string' &&
          actualLabel.indexOf('<msid-url>') !== -1
        ) {
          //gives ga label as msid or url
          const currPath = window.location.pathname;
          if (currPath.indexOf('/') !== -1) {
            const currPathMsid = currPath
              .split('/')
              .reverse()
              .slice(0, 1)
              .join('')
              .replace('.cms', '');
            if (currPathMsid.match(/\d+/)) {
              actualLabel = actualLabel.replace(
                '<msid-url>',
                `msid_${currPathMsid}`,
              );
            } else {
              actualLabel = `-url_${actualLabel.replace(
                '<msid-url>',
                `url_${window.location.href}`,
              )}`;
            }
          }
        }
        if (
          actualCategory !== '' &&
          actualAction !== '' &&
          actualAction !== 'action'
        ) {
          analyticsWrapper(
            'gaAndGrx',
            'send',
            'event',
            actualCategory,
            actualAction,
            actualLabel,
          );
        }
      }
      // console.log(params);
      // console.log('starting %s', key);
      fn.apply(this, args);
      // console.log('ending %s', key);
    };
    // we then overwrite the origin descriptor value
    // and return the new descriptor
    // eslint-disable-next-line no-param-reassign
    descriptor.value = newFn;
    return descriptor;
  };
};
