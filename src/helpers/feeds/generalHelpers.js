// eslint-disable-next-line import/prefer-default-export
export const getExternalFeedUrl = () => {
  if (__PROD__) {
    return 'https://toifeeds.indiatimes.com/treact/feeds/toi/web/ext?path=';
  }
  if (typeof window === 'object') {
    return 'https://pwastg.timesofindia.com/feeds/toi/web/ext?path=';
  }
  return 'http://pwastg.timesofindia.com/feeds/toi/web/ext?path=';
};

export const getFeedUrl = () => {
  if (__PROD__) {
    return 'https://toifeeds.indiatimes.com/treact/feeds';
  }
  if (typeof window === 'object') {
    //return 'http://localhost:3035/feeds';
    if (__PREVIEW__) {
      return 'https://toipreviewfeeds.timesofindia.com/feeds';
    }
    return 'https://pwastg.timesofindia.com/feeds';
    // return 'http://toifeedsstaging.indiatimes.com/feeds';
  }
  //return 'http://localhost:3035/feeds';
  if (__PREVIEW__) {
    return 'http://toipreviewfeeds.timesofindia.com/feeds';
  }
  return 'http://pwastg.timesofindia.com/feeds';
  // return 'http://toifeedsstaging.indiatimes.com/feeds';
};
