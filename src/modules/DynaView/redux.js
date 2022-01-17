import makeRequest from 'utils/makeRequest';
import reducerRegistry from '../../reduxUtils/reducerRegistry';

const initialUserState = {
  dataList: [],
  datactr: 0,
};
const reducerName = 'dataList';
const createActionName = name => `toi/${reducerName}/${name}`;

// actions
export const LIST_STORIES_ACTIVATE = createActionName('LIST_STORIES_ACTIVATE');
export const LIST_STORIES_DEACTIVATE = createActionName(
  'LIST_STORIES_DEACTIVATE',
);

function fetchDataList(params) {
  if (params === null) {
    return null;
  }
  const url = `/navjson/nav-${params},preload-1.cms`;
  return makeRequest.get(url);
}

function receiveHoverStories(data, msid) {
  return {
    type: LIST_STORIES_ACTIVATE,
    payload: data.items && data.items[0] ? [data.items[0]] : [data],
    msid,
  };
}
function handleHoverStoriesError() {
  console.log('error occur');
}

export function loadDataList(params) {
  return dispatch => {
    if (params.msid) {
      fetchDataList(params.msid)
        .then(data => dispatch(receiveHoverStories(data.data, params.msid)))
        .catch(error => handleHoverStoriesError(error));
    } else {
      Object.entries(params.navigation.data.sections).map(([, value]) => {
        if (
          value.msid &&
          (!params.dataReceived ||
            params.dataReceived.indexOf(value.msid) === -1)
        ) {
          return fetchDataList(value.msid)
            .then(data => dispatch(receiveHoverStories(data.data, value.msid)))
            .catch(error => handleHoverStoriesError(error));
        }
        return '';
      });
    }
  };
}
export default function reducer(state = initialUserState, action) {
  switch (action.type) {
    case LIST_STORIES_ACTIVATE:
      return {
        ...state,
        dataList: [...state.dataList, action.payload],
        dataReceived: `${state.dataReceived},${action.msid}`,
        //dataList: [Object.assign([...state.dataList], action.payload)],

        //dataList: (state.dataList ? state.dataList : []).push(action.payload),
        //dataList: [state.dataList ? state.dataList : [], action.payload],
        // dataList: Object.assign({}, ...state.dataList, action.payload),
        // datactr: state.datactr + 1,
      };
    default:
      return state;
  }
}
reducerRegistry.register(reducerName, reducer);
