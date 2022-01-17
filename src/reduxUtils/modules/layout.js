// import { loadNavigationData, updateActiveSubSection } from './navigation';
import { getSiteConfig } from 'reduxUtils/modules/common';
import { loadNavigationData } from './navigation';
import { loadFooterData } from './footer';
import { loadRhsData } from './RHS';
// import isMobile from '../../utils/isMobile';

export default function loadLayoutData(params, state, promiseArray) {
  const dataPromiseArray = promiseArray || [];
  const { isWapView } = params.navigation;
  return dispatch => {
    // load data if not available, to stop unnecessary client side calls
    let parentNavChanged = false;
    let sameSectionRouting = false;
    let path;
    const currPath = state.navigation.data
      ? state.navigation.data.path.split('/')
      : [];
    if (params.navigation && params.navigation.fullPath) {
      path = params.navigation.fullPath.split('/');
      // path 0 is empty as / is in path start too
      // path 1 is main/parent section
      // path 2 is active sub section

      // parent section has changed
      if (path[1] !== currPath[1]) {
        parentNavChanged = true;
      } else if (params.navigation.clientRouting) {
        // dispatch(updateActiveSubSection(path));
      }
    }

    if (params.navigation.clientRouting && !parentNavChanged) {
      sameSectionRouting = true;
    }

    if (
      (!state.navigation ||
        !state.navigation.data ||
        params.navigation.clientRouting) &&
      // Not used as of now. Navigation call to be made everytime on route change
      // || !sameSectionRouting
      !params.navigation.skipNavigationCalls
      // navigation feed updated to send only data required by next route
      // (params.navigation.clientRouting && parentNavChanged)
    ) {
      dataPromiseArray.push(
        dispatch(
          loadNavigationData({
            ...params.navigation,
            isWapView,
            sameSectionRouting,
          }),
        ),
      );
    }

    if (!state.footer || !state.footer.data) {
      dataPromiseArray.push(dispatch(loadFooterData(params.footer)));
    }

    if (params.rhs && (!state.rhs || !state.rhs.rhsData)) {
      dataPromiseArray.push(dispatch(loadRhsData(params.rhs)));
    }

    if (typeof window === 'undefined') {
      dataPromiseArray.push(dispatch(getSiteConfig()));
    }

    return dataPromiseArray;
  };
}
