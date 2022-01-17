import reducerRegistry from 'reduxUtils/reducerRegistry';

const reducerName = 'commonData';
const createActionName = name => `toi/${reducerName}/${name}`;

export const RECEIVE_COMMON_DATA = createActionName('RECEIVE_COMMON_DATA');

export function receiveCommonData(data) {
  return {
    type: RECEIVE_COMMON_DATA,
    payload: {
      ...data,
    },
  };
}

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case RECEIVE_COMMON_DATA: {
      return {
        ...state,
        data: action.payload,
      };
    }

    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
