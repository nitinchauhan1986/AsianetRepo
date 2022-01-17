import {
  SESSIONS,
  PAGE,
  //TIMEFRAME,
  ALLOWEDINTIMEFRAME,
  STORAGENAME,
} from '../components/PrimePaymentFlow/PrimeScreen/AddFreeSessionLoyalUsers/config';

export default function checkConditionsForLoyalUsers() {
  const storagename = STORAGENAME;
  const sessions = SESSIONS;
  const page = PAGE;
  //const timeframe = TIMEFRAME;
  const allowedintimeframe = ALLOWEDINTIMEFRAME;
  // eslint-disable-next-line func-names
  const incrementCounters = function(cookieObj) {
    const obj = {
      pageCount: 1,
      sessionCount: 1,
      adfreesessionCount: 0,
    };
    const objFromCookie = {};
    if (!cookieObj) {
      obj.timestamp = new Date().getTime();
      //  sessionStorage.setItem(storagename, 1);
    } else {
      objFromCookie.timestamp = cookieObj.timestamp;
      objFromCookie.sessionCount = Number(cookieObj.sessionCount);
      objFromCookie.adfreesessionCount = Number(cookieObj.adfreesessionCount);
      if (sessionStorage.getItem(storagename) === null) {
        //first time hit in session
        //   sessionStorage.setItem(storagename, 1);
        objFromCookie.sessionCount += 1;
      } else {
        // not first time hit , increase no of pages
        objFromCookie.pageCount = Number(cookieObj.pageCount) + 1;
      }
    }

    Object.assign(obj, objFromCookie);

    return {
      pageCount: obj.pageCount,
      sessionCount: obj.sessionCount,
    };
  };
  // eslint-disable-next-line func-names
  const allowedinTimeFrame = function() {
    let cookieObj;
    if (localStorage.getItem(storagename)) {
      try {
        cookieObj = JSON.parse(localStorage.getItem(storagename));
      } catch (err) {
        //console.log(err)
      }
    }
    if (cookieObj) {
      const adfreesessionCount = Number(cookieObj.adfreesessionCount);
      if (adfreesessionCount < allowedintimeframe) {
        return incrementCounters(cookieObj); // increment counter if allowed
      }
      return false; //dont do anything if user have taken all sessions
    }
    return incrementCounters(cookieObj); // first time user ,increment counter
  };

  const cookieObj = allowedinTimeFrame();
  const { sessionCount, pageCount } = cookieObj;
  if (sessions === sessionCount && pageCount <= page) {
    window.winLoyalusers = true;
    return true;
  }

  return true;
}

//checkConditionsForPopup();
