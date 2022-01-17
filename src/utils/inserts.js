import React from 'react';

const getReactElementsFromInserts = (
  { insertsArray, typeComponentMapping },
  country,
  itemIndex,
  isLead,
  gaAction,
) => {
  const myArray = [];
  if (
    !(insertsArray instanceof Array) ||
    typeof typeComponentMapping !== 'object'
  ) {
    return [];
  }
  insertsArray.forEach(item => {
    const myComponentCallerFunction =
      typeComponentMapping[item.tn || item.type];
    if (typeof myComponentCallerFunction === 'function') {
      const myReactElement = myComponentCallerFunction(
        item,
        country,
        itemIndex,
        isLead,
        gaAction,
      );
      if (React.isValidElement(myReactElement)) {
        myArray.push({
          position: item.position - 1,
          component: myReactElement,
        });
      }
    }
  });
  return myArray;
};

// eslint-disable-next-line import/prefer-default-export
export { getReactElementsFromInserts };
