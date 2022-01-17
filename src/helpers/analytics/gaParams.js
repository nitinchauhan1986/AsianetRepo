/* eslint-disable import/prefer-default-export */
import { dimensionMapping } from '../../constants';

export default {
  __html: `window.TimesGA = window.TimesGA || {};
    window.TimesGA.setGAParams = (gaData, isServerView) => {
      const gaParams = isServerView && window.App ? window.App.gaData : gaData;
      if (typeof gaParams !== 'object') {return;}
      window.ga('set', 'contentGroup1', gaParams.contentGroup1);
      window.ga('set', 'dimension4', gaParams.dimension4);
      window.ga('set', 'dimension5', gaParams.dimension5);
      window.ga('set', 'dimension8', gaParams.dimension8);
      window.ga('set', 'dimension9', gaParams.dimension9);
      window.ga('set', 'dimension11', gaParams.dimension11);
      window.ga('set', 'dimension23', gaParams.dimension23);
      window.ga('set', 'dimension26', gaParams.dimension26);
      window.ga('set', 'dimension27', gaParams.dimension27);
      window.ga('set', 'dimension39', gaParams.dimension39);
      window.ga('set', 'dimension40', gaParams.dimension40);
      window.ga('set', 'dimension41', gaParams.dimension41);
      window.ga('set', 'dimension42', gaParams.dimension42);
      window.grx('set', '${
        dimensionMapping.contentGroup1
      }', gaParams.contentGroup1);
      window.grx('set', '${dimensionMapping.dimension4}', gaParams.dimension4);
      window.grx('set', '${dimensionMapping.dimension5}', gaParams.dimension5);
      window.grx('set', '${dimensionMapping.dimension8}', gaParams.dimension8);
      window.grx('set', '${dimensionMapping.dimension9}', gaParams.dimension9);
      window.grx('set', '${
        dimensionMapping.dimension11
      }', gaParams.dimension11);
      window.grx('set', '${
        dimensionMapping.dimension23
      }', gaParams.dimension23);
      window.grx('set', 'dimension26', gaParams.dimension26);
      window.grx('set', 'dimension27', gaParams.dimension27);
      window.grx('set', 'dimension39', gaParams.dimension39);
      window.grx('set', 'dimension40', gaParams.dimension40);
      window.grx('set', 'dimension41', gaParams.dimension41);
      window.grx('set', 'dimension42', gaParams.dimension42);
    };`,
};
