import { useState } from 'react';

const useMergeState = initialState => {
  const [state, updateState] = useState(initialState);

  const mergeState = newState => {
    updateState(prevState => {
      // const updated = Object.assign({}, prevState, newState);
      const updated = { ...{}, ...prevState, ...newState };
      return updated;
    });
  };

  return [state, mergeState];
};

export default useMergeState;
