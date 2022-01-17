import reducerRegistry from '../../reduxUtils/reducerRegistry';
// import makeRequest from '../../utils/makeRequest';

const reducerName = 'commonPopUpManager';
const createActionName = name => `toi/${reducerName}/${name}`;

export const ALL_FORCE_HIDE = createActionName('ALL_FORCE_HIDE');

export function allForceHidePopUp(forceHide) {
  return {
    type: ALL_FORCE_HIDE,
    payload: {
      forceHide,
    },
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case ALL_FORCE_HIDE:
      return {
        ...state,
        forceHide: action.payload.forceHide,
      };
    default:
      return state;
  }
}
reducerRegistry.register(reducerName, reducer);
