const videoURL = __PROD__
  ? 'https://toifeeds.indiatimes.com/treact/feeds/toi/web/list/video'
  : 'https://pwastg.timesofindia.com/feeds/toi/web/list/video';

// const videoURL =
//   'https://toifeeds.indiatimes.com/treact/feeds/toi/web/list/video';

const getVideoFeedUrl = ({
  path = '',
  perpage = '',
  curpg = 1,
  reqtype = '',
}) => {
  const perpageParam = perpage ? `&perpage=${perpage}` : '';
  const curpgParam = curpg ? `&curpg=${curpg}` : '';
  const reqtypeParam = reqtype ? `&reqtype=${reqtype}` : '';
  if (typeof window === 'object') {
    return `${videoURL}?path=${path}${perpageParam}${curpgParam}${reqtypeParam}`;
  }
  return `${videoURL}?path=${path}${perpageParam}${curpgParam}${reqtypeParam}`.replace(
    'https',
    'http',
  );
};

export default getVideoFeedUrl;
