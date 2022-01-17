import reducerRegistry from '../reducerRegistry';

const reducerName = 'affiliates';
const createActionName = name => `toi/${reducerName}/${name}`;

export const SET_SALE_NUDGE_STATUS = createActionName('SET_SALE_NUDGE_STATUS');

export function setSaleNudgeVisibility(status) {
  return {
    type: SET_SALE_NUDGE_STATUS,
    payload: status,
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_SALE_NUDGE_STATUS:
      return {
        ...state,
        saleNudgeVisible: action.payload,
      };
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
