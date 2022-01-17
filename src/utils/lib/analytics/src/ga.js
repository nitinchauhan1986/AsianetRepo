import _get from 'lodash.get';
import axios from 'axios';
import analyticsWrapper from '../../../../helpers/analytics/analyticsWrapper';

const validVideoEventsMap = [
  'VIDEOREQUEST',
  'VIDEOLOADREQUEST',
  'VIDEOREADY',
  'VIDEOVIEW',
  'VIDEOCOMPLETE',
  'ADREQUEST',
  'ADLOADED',
  'ADCOMPLETE',
  'ADSKIP',
  'ADVIEW',
  'ADERROR',
];

const validAdEventsMap = [
  'ADREQUEST',
  'ADLOADED',
  'ADCOMPLETE',
  'ADSKIP',
  'ADVIEW',
  'ADERROR',
];

const adTypeConfig = {
  pre: 'Preroll',
  post: 'Postroll',
};

const TimesApps = {
  playingSubsequentVideo: false,
  currentVideoData: null,
};

TimesApps.FLAGS = {
  READY: 'READY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  AD_COMPLETED: 'AD_COMPLETED',
  REPLAY: 'REPLAY',
  NEXT_VIDEO: 'NEXT_VIDEO',
};

TimesApps.getVideoData = (msid, configObj) => {
  axios
    .get(
      `/feeds/videomediainfo_v1/msid-${msid},feedtype-json.cms`,
      {},
      'skipfeedengine',
    )
    .then(res => {
      const { item } = res && res.data;
      if (!item) {
        return;
      }
      TimesApps.videoDataReceivedCallback(item, configObj);
    })
    .catch(err => {
      console.log(err);
    });
};

TimesApps.videoDataReceivedCallback = (data, configObj) => {
  if (!data || Object.keys(data).length <= 0) {
    return;
  }
  TimesApps.currentVideoData = { ...data };
  TimesApps.fireGAForVideoEvents(configObj);
};

TimesApps.makeGAForVideoEvents = ({ eventData, eventType, player }) => {
  const { msid } = eventData;
  if (!msid) return;

  const ga = window.ga || window.parent.ga;
  window.TimesApps = TimesApps;

  if (
    typeof ga === 'undefined' ||
    validVideoEventsMap.indexOf(eventType) === -1
  ) {
    return;
  }

  if (TimesApps.currentVideoData === null) {
    TimesApps.getVideoData(msid, {
      eventData,
      eventType,
      player,
    });
  } else {
    const { msid: _msid } = TimesApps.currentVideoData;
    if (_msid !== msid) {
      TimesApps.getVideoData(msid, {
        eventData,
        eventType,
        player,
      });
    } else {
      TimesApps.fireGAForVideoEvents({
        eventData,
        eventType,
        player,
      });
    }
  }
};

TimesApps.fireGAForVideoEvents = ({ eventType }) => {
  const newEventType = eventType ? eventType.toUpperCase() : '';
  const { seopath, title } = TimesApps.currentVideoData;
  const _title = TimesApps.getEventLabel({ eventType, title });
  analyticsWrapper('gaAndGrx', 'send', {
    hitType: 'event',
    eventCategory: newEventType,
    eventAction: seopath,
    eventLabel: _title,
  });
};

TimesApps.getEventLabel = ({ eventType, title }) => {
  if (
    eventType === 'VIDEOCOMPLETE' ||
    eventType === 'VIDEOREADY' ||
    eventType === 'VIDEOVIEW'
  ) {
    return title;
  }
  return 'amp_videoshow';
};

TimesApps.makeGAForAdEvents = ({ eventData = {}, eventType, player }) => {
  const { msid } = eventData;
  if (!msid) return;

  const title = _get(player, 'store.mediaConfig.title', {}) || '';
  const ga = window.ga || window.parent.ga;
  if (typeof ga === 'undefined' || validAdEventsMap.indexOf(eventType) === -1) {
    return;
  }
  const { type } = eventData;
  const adType = adTypeConfig[type] ? adTypeConfig[type] : '';
  const eventTypeConfig = {
    ADVIEW: 'AdView',
    ADCOMPLETE: 'AdComplete',
    ADSKIP: 'AdSkip',
    ADLOADED: 'AdLoaded',
    ADREQUEST: 'AdRequest',
    ADERROR: 'AdError',
  };
  if (adType) {
    if (
      '|AdRequest|AdLoaded|AdView|AdSkip|AdComplete|AdError|'.indexOf(
        eventTypeConfig[eventType],
      ) !== -1
    ) {
      analyticsWrapper('gaAndGrx', 'send', {
        hitType: 'event',
        eventCategory: eventTypeConfig[eventType],
        eventAction: adType,
        eventLabel: title,
      });
    }
  }
};

export default TimesApps;
