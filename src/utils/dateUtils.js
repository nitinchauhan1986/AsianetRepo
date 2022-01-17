/* eslint-disable no-param-reassign */
import { format } from 'date-fns';

export function getMilliSecondsTimestamp(timestamp) {
  if (typeof timestamp === 'undefined') {
    return '';
  }
  let milliTimestamp = timestamp;
  const timestampLen = timestamp.toString().length;
  const zerosToAdd = 13 - timestampLen;

  if (zerosToAdd > 0) {
    for (let i = 0; i < zerosToAdd; ) {
      milliTimestamp *= 10;
      i += 1;
    }
  }

  return milliTimestamp;
}
export function dateToStringWithFormat(timestamp, dateFormat) {
  if (timestamp && timestamp.indexOf && timestamp.indexOf('-') !== -1) {
    const nowDate = new Date(timestamp);
    timestamp = nowDate.getTime();
  }
  const validTimestamp = Number(getMilliSecondsTimestamp(timestamp));
  const date = new Date(validTimestamp);
  const timestamp2 =
    validTimestamp + date.getTimezoneOffset() * 60 * 1000 + 330 * 60 * 1000;
  const readableTime = format(timestamp2, dateFormat);
  if (readableTime === 'Invalid Date') return '';
  return readableTime;
}

export default {
  getMilliSecondsTimestamp,
  dateToStringWithFormat,
};
