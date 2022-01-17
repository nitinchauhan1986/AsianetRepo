/* eslint-disable import/prefer-default-export */
import produce from 'immer';
import reducerRegistry from '../../reduxUtils/reducerRegistry';
import makeRequest from '../../utils/makeRequest';

const reducerName = 'navigation';
const createActionName = name => `toi/${reducerName}/${name}`;
const initialUserState = {
  navStories: {},
};
export const RECEIVE_DATA = createActionName('RECEIVE_DATA');
export const HANDLE_DATA_ERROR = createActionName('HANDLE_DATA_ERROR');
export const RECEIVE_STORIES = createActionName('RECEIVE_STORIES');
function receiveNavigationData(data) {
  // console.log('receiveNavigationData', data);
  return {
    type: RECEIVE_DATA,
    payload: data,
  };
}
function receiveNavigationStories(id, data) {
  return {
    type: RECEIVE_STORIES,
    payload: data,
    key: id,
  };
}

function handleNavigationError(error) {
  return {
    type: HANDLE_DATA_ERROR,
    error,
  };
}

function fetchNavigationStories(param, params) {
  let url = `/navjson_etimes/feedtype-sjson,nav-${param}.cms`;
  if (params) url += params;
  return makeRequest.get(url, {}, 'skipfeedengine');
}
export function loadNavigationStories(id) {
  return dispatch => {
    if (id) {
      fetchNavigationStories(id)
        .then(data => dispatch(receiveNavigationStories(id, data.data, 1)))
        .catch(error => dispatch(handleNavigationError(error)));
    }
  };
}

function createHeaderJson(configJson, levelJson, isWapView) {
  const headerConfigJson = JSON.parse(
    JSON.stringify(configJson).replace(
      /subsec0|subsec1|subsec2|subsec3/gi,
      'sections',
    ),
  );
  let level1;
  const HeaderJson = {
    sections: isWapView
      ? [...headerConfigJson.navigation]
      : [headerConfigJson.navigation[0]],
    breadCrumbs: [],
  };
  HeaderJson.colorTheme = levelJson.colorTheme;
  HeaderJson.sections[0].sections = [];
  headerConfigJson.navigation.forEach((elem1, index) => {
    if (elem1.ssname === levelJson.l1) {
      level1 = elem1;
      level1.active = true;
      HeaderJson.breadCrumbs.push({
        label: level1.ssname,
        link: level1.overridelink,
      });
      //Checking if we get last msid on level1
      if (
        (elem1.sections && level1['@catkey'] !== levelJson.last_level) ||
        level1['@catkey1'] !== levelJson.last_level
      ) {
        elem1.sections.forEach(elem2 => {
          const ob2 = elem2;
          //Checking if we get last msid on level2
          if (
            elem2['@catkey'] === levelJson.last_level ||
            elem2['@catkey1'] === levelJson.last_level
          ) {
            ob2.active = true;
            HeaderJson.breadCrumbs.push({
              label: elem2.ssname,
              link: elem2.overridelink,
            });
          } else if (elem2.sections) {
            elem2.sections.forEach(elem3 => {
              const ob3 = elem3;
              //Checking if we get last msid on level3
              if (
                elem3['@catkey'] === levelJson.last_level ||
                elem3['@catkey1'] === levelJson.last_level
              ) {
                ob3.active = true;
                ob2.active = true;
                HeaderJson.breadCrumbs.push({
                  label: elem2.ssname,
                  link: elem2.overridelink,
                });
                HeaderJson.breadCrumbs.push({
                  label: elem3.ssname,
                  link: elem3.overridelink,
                });
              }
            });
          }
        });
      }
    }

    if (index > 0 && !isWapView) {
      const obj = Object.assign({}, elem1);
      obj.sections = [];
      HeaderJson.sections[0].sections = [
        ...HeaderJson.sections[0].sections,
        obj,
      ];
    }
  });
  HeaderJson.breadCrumbs.push({
    label: levelJson.title,
    link: '',
  });
  if (!isWapView) {
    HeaderJson.sections.push(level1);
  }
  return HeaderJson;
}
export function loadNavigationData(params) {
  return dispatch => {
    let msidParameter = '';
    if (params.msid) {
      msidParameter = `,msid-${params.msid}`;
    }
    const domain = params.isWapView
      ? 'https://m.timesofindia.com'
      : 'https://timesofindia.indiatimes.com';
    const url1 = `${domain}/etimesconfig_react/feedtype-json.cms`;
    const url2 = `https://timesofindia.indiatimes.com/get_nav_etimes/feedtype-json${msidParameter}.cms`;
    Promise.all([makeRequest.get(url1), makeRequest.get(url2)]).then(data => {
      const HeaderJson = createHeaderJson(
        data[0].data,
        data[1].data,
        params.isWapView,
      );
      return dispatch(receiveNavigationData(HeaderJson));
    });
  };
}

export default function reducer(state = initialUserState, action) {
  const { payload } = action;
  switch (action.type) {
    case RECEIVE_DATA:
      // console.log('RECEIVE_DATA', state);
      // console.log('RECEIVE_DATA_PAYLOAD', payload);

      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
        // timestamp: Date.now(),
      };
    case RECEIVE_STORIES: {
      const newState = produce(state, draftState => {
        const stories = draftState.navStories || {};
        if (payload.items instanceof Array) {
          payload.items.forEach(item => {
            stories[item.catkey] = item;
          });
        } else {
          stories[action.key] = payload;
        }
      });
      return newState;
    }
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);
