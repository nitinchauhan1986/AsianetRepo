import reducerRegistry from 'reduxUtils/reducerRegistry';

const reducerName = 'header';
const createActionName = name => `toi/${reducerName}/${name}`;

export const RECEIVE_NAV_DATA = createActionName('RECEIVE_NAV_DATA');
export const GET_ACTIVE_CFMID = createActionName('GET_ACTIVE_CFMID');

function updateActiveSubSectionUsingCfmid(actualData, activeCfmid) {
  let counter = 0;
  if (!actualData) {
    return {};
  }
  const tempData = JSON.parse(JSON.stringify(actualData));
  const data = tempData.navigation;
  if (data && data.l2 && data.l2.length > 0 && activeCfmid) {
    for (; counter < data.l2.length; counter += 1) {
      if (data.l2[counter].cfmid === activeCfmid) {
        const cfmNode = data.l2.splice(counter, 1)[0];
        cfmNode.selected = true;
        data.l2.splice(0, 0, cfmNode);
        break;
      }
    }
  }

  tempData.navigation = data;
  return tempData;
}

export function receiveNavigationData(data) {
  return {
    type: RECEIVE_NAV_DATA,
    payload: {
      ...data,
    },
  };
}

export function getActiveCfmid(data) {
  return {
    type: GET_ACTIVE_CFMID,
    payload: data,
  };
}

export default function reducer(state = {}, action = {}) {
  const { payload } = action;
  switch (action.type) {
    case RECEIVE_NAV_DATA: {
      return {
        ...state,
        data: action.payload,
      };
    }
    case GET_ACTIVE_CFMID: {
      const data = updateActiveSubSectionUsingCfmid(state.data, payload);
      // const data = '';
      return {
        ...state,
        timestamp: Date.now(),
        data: data || state.data,
      };
    }

    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
