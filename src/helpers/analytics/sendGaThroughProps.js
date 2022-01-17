import { gaWrapper } from 'helpers/analytics';

// eslint-disable-next-line import/prefer-default-export
export function sendGaThroughProps({ data }) {
  // const
  if (typeof data !== 'object') {
    return;
  }
  let { gaAction, gaLabel, gaCategory } = data;
  if (typeof gaAction === 'string' && typeof gaLabel === 'string') {
    if (!data.noSpaceReplace) {
      gaAction = gaAction.split(' ').join('');
    }
    gaAction = gaAction.split('&').join('');
    if (!data.noSpaceReplace) {
      gaLabel = gaLabel.split(' ').join('');
    }
    gaLabel = gaLabel.split('&').join('');
  }
  if (typeof gaCategory !== 'string') {
    gaCategory = window.categoryForGA;
  }
  if (window && window.categoryForGA && data) {
    gaWrapper('send', 'event', gaCategory, gaAction, gaLabel);
  }
}
