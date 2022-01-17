import React from 'react';
import {
  amazonPrebidScript,
  amazonPrebidScriptMobile,
} from 'helpers/ads/constants';

const commonHeadScripts = [
  <script dangerouslySetInnerHTML={{ __html: amazonPrebidScript }} />,
];
const commonHeadScriptsMobile = [
  <script dangerouslySetInnerHTML={{ __html: amazonPrebidScriptMobile }} />,
];

// eslint-disable-next-line import/prefer-default-export
export { commonHeadScripts, commonHeadScriptsMobile };
