/* eslint-disable import/prefer-default-export */
import reducerRegistry from '../../reduxUtils/reducerRegistry';
// import makeRequest from '../../utils/makeRequest';

const reducerName = 'commentscommon';
const createActionName = name => `toi/${reducerName}/${name}`;

// actions
export const OPEN_SIDEBAR = createActionName('OPEN_SIDEBAR');

export function openSidebar(msid, commentId) {
  return {
    type: OPEN_SIDEBAR,
    payload: {
      msid: msid || '',
      commentId: commentId || '',
    },
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case OPEN_SIDEBAR:
      return {
        ...state,
        sidebarOpen: action.payload.msid || '',
        commentIdHighlighted: action.payload.commentId || '',
      };
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
