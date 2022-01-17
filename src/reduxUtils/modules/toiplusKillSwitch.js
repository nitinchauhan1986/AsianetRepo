/* eslint-disable import/prefer-default-export */

import { SUBSCRIPTION_STAGE_DOMAIN } from 'constants/index';
import reducerRegistry from '../reducerRegistry';
import makeRequest from '../../utils/makeRequest';

const reducerName = 'toipluskillswitch';
const createActionName = name => `toi/${reducerName}/${name}`;

export const RECEIVED_KILL_SWITCH_DATA = createActionName(
  'RECEIVED_KILL_SWITCH_DATA',
);
export const ERROR_KILL_SWITCH_DATA = createActionName(
  'ERROR_KILL_SWITCH_DATA',
);

function receiveKillStatus(data) {
  return {
    type: RECEIVED_KILL_SWITCH_DATA,
    payload: {
      data,
    },
  };
}
function handleError(error) {
  return {
    type: ERROR_KILL_SWITCH_DATA,
    error,
  };
}

export function loadKillSwitchData(isWapView) {
  return dispatch => {
    const platform = isWapView ? 'toim' : 'toiw';
    const options = {
      params: {
        lang: '1',
        fv: '668',
      },
    };
    makeRequest
      .get(
        `${SUBSCRIPTION_STAGE_DOMAIN}/subscriptions/config/${platform}/switch`,
        options,
        options,
      )
      .then(response => {
        dispatch(receiveKillStatus(response.data));
      })
      .catch(error => {
        dispatch(handleError(error));
      });
  };
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case RECEIVED_KILL_SWITCH_DATA:
      return {
        ...state,
        killSwitchStatus: action.payload,
      };
    case ERROR_KILL_SWITCH_DATA:
      return {
        ...state,
        killSwitchStatus: null,
      };
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
