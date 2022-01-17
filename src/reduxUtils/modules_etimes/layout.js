import { getSiteConfig } from 'reduxUtils/modules/common';
import { loadNavigationData } from './navigation';
import { loadFooterData } from './footer';
import { loadRhsData } from './../modules/RHS';

export default function loadLayoutData(params, state, promiseArray) {
  const dataPromiseArray = promiseArray || [];
  const { isWapView } = params.navigation;
  return dispatch => {
    if (
      (!state.navigation ||
        !state.navigation.data ||
        params.navigation.clientRouting) &&
      !params.navigation.skipNavigationCalls
    ) {
      dataPromiseArray.push(
        dispatch(
          loadNavigationData({
            ...params.navigation,
            isWapView,
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
