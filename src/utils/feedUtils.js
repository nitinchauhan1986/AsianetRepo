function getTimeStampParameter() {
  if (global.upcache === true) {
    return global.requestTimeStamp;
  }

  return null;
}
// eslint-disable-next-line import/prefer-default-export
export { getTimeStampParameter };
