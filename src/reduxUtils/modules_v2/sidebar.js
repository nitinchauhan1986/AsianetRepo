import reducerRegistry from 'reduxUtils/reducerRegistry';

const reducerName = 'sidebar';
const createActionName = name => `toi/${reducerName}/${name}`;

export const RECEIVE_SIDEBAR_DATA = createActionName('RECEIVE_SIDEBAR_DATA');

export function receiveSidebarData(data) {
  return {
    type: RECEIVE_SIDEBAR_DATA,
    payload: {
      ...data,
    },
  };
}

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case RECEIVE_SIDEBAR_DATA: {
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
