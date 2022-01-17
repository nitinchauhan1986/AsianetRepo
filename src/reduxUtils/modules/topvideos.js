import getVideoFeedUrl from 'helpers/feeds/videoHelpers';
import reducerRegistry from '../../reduxUtils/reducerRegistry';
import makeRequest from '../../utils/makeRequest';

const reducerName = 'topvideos';
const createActionName = name => `toi/${reducerName}/${name}`;

export const RECEIVE_DATA = createActionName('RECEIVE_DATA');
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');
function fetchtopvideos() {
  const url = getVideoFeedUrl({
    path: '/videos/top-videos',
    perpage: 5,
    curpg: 1,
  });
  return makeRequest.get(url);
}

export function receiveVideosearchdata(data) {
  return {
    type: RECEIVE_DATA,
    payload: data.data.data,
  };
}

function handleVideosearchDataError() {
  return {
    type: HANDLE_DATA_ERROR,
  };
}

export function loadtopvideos() {
  return dispatch =>
    fetchtopvideos()
      .then(data => dispatch(receiveVideosearchdata(data)))
      .catch(error => dispatch(handleVideosearchDataError(error)));
}

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case RECEIVE_DATA: {
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
