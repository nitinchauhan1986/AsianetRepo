/* eslint-disable import/prefer-default-export */
/* eslint-disable func-names */
import axios from 'axios';
import Cookie from '../../utils/cookies';

export function savingsApi() {
  window.TimesApps.SavingsAPI = (function() {
    let readyToFire = false;
    const callQueue = [];

    const fn = {
      fireAPI(msid) {
        if (!readyToFire) {
          callQueue.push({ msid });
          return;
        }

        const ssoId = Cookie.get('ssoid') || Cookie.get('ssoId');
        const ticketId = Cookie.get('TicketId');
        const data = {
          user: {
            ssoId,
            ticketId,
          },
          otherDetails: {
            articleId: msid || '',
            articleName: '',
          },
        };

        axios.post(
          'https://api.timesprime.com/prime/external/updateTOISavings',
          data,
        );
      },
      fireCallsOnReady() {
        if (callQueue && callQueue.length > 0) {
          for (let i = 0; i < callQueue.length; i += 1) {
            fn.fireAPI(callQueue[i].msid);
          }
        }
      },
      initializeApi() {
        readyToFire = true;
        fn.fireCallsOnReady();
      },
      addCallsToQueue(msid) {
        fn.fireAPI(msid);
      },
    };

    const returnFn = {
      initializeApi() {
        fn.initializeApi();
      },
      addCallsToQueue(msid) {
        fn.addCallsToQueue(msid);
      },
    };

    return returnFn;
  })();
}
