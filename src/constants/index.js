/* eslint-disable import/prefer-default-export */
export const TOI_LIVE_DOMAIN = 'https://timesofindia.indiatimes.com';
export const TOI_LIVE_MOBILE_DOMAIN = 'https://m.timesofindia.com';
export const TOI_DEV_DOMAIN = 'https://toidev.indiatimes.com';
export const TOI_DEV_MOBILE_DOMAIN = 'https://spmdev.indiatimes.com';
export const TOI_IMAGE_DOMAIN = 'https://static.toiimg.com';
export const TOI_FEED_DOMAIN = 'https://toibnews.timesofindia.indiatimes.com';
export const TOI_SEO_DOMAIN = 'https://timesofindia.indiatimes.com';
export const TOI_SITE_NAME = 'Times Of India';
export const GOOGLE_WEBCACHE_DOMAIN = 'webcache.googleusercontent.com';
export const GENDER_SUBSCRIBE_COOKIE = 'gendernlsubscription';
export const GEOAPI_URL = 'https://geoapi.indiatimes.com/?cb=1';
export const POPUP_MANAGER_LOADED = 'popUpManagerLoaded';
export const ACTIVE_PRIME_USER_PRC_ARR = [1, 3, 4, 5, 8];
export const DEAULT_PAID_POINTS_SUBSCRIPTION = 200;
export const PRC_PRIME_API =
  'https://nprelease.indiatimes.com/prime-auth/prime/status/setCookies';

export const PRC_FOR_NEVER_REGISTER = 0; // 0, -1 or not present  - Never register with prime
export const PRC_FOR_FTU = 1; // 1 = Free Trial Active
export const PRC_FOR_FT_EXPIRED = 2; // 2 = Free Trial Expired
export const PRC_FOR_FTA_PAYMENT = 3; // 3 = free trial and payment
export const PRC_FOR_FT_PAYMENT_EXPIRED = 4; // 4 = Free Trial with payment expired
export const PRC_FOR_SUBSCRIBED = 5; // Subscription or Paid User
export const PRC_FOR_SUBSCRIPTION_EXPIRED = 6; // Subscription expired
export const PRC_FOR_SUBSCRIPTION_CANCELLED = 7; // 7 = Subscription cancelled
export const PRC_FOR_SUBSCRIPTION_AUTORENEW = 8; // 8 = Subscription Auto - Renewal
export const PRC_FOR_NOT_LOGIN = -1; // not login
export const STAGING_URL_PREFIX = '/intarnel'; // every URLL on staging will be prefix by this
export const STAGING_URL_PREFIX2 = '/internal'; // every URLL on staging will be prefix by this

export const PRIMESCREEN_STORAGE_NAME = {
  TopBand: {
    DISMISS: 'tbpdsn',
    CTACLICK: 'tbsf',
    SESSIONNAME: 'tbsc',
  },
  Toast: 'primeVideoToolTip',
};
export const CONGRATS_POPUP_STORAGE_NAME = 'congrats_popup';
export const ALREADY_PRIME_USER_STORAGE_NAME = 'already_prime_user';
export const DOWNLOAD_APP_POPUP_STORAGE_NAME = 'download_app_popup';
export const LOGIN_MAPPED_ON_LIVE = false;
export const AB_TESTING_LIVEBLOG_AD_REPLACEMENT = 'KdSO35O7RIewQr9HpQ3BIg';
export const ACTIVITY_MAXCAP_MAP = 'allActivityConfig';
export const ACTIVITY_ACCRUE_MAP = 'achievedActConfig';
export const ETIMES_SUBSCRIBE_COOKIE = 'etimes_subscribe';
// export const GENDER_SUBSCRIBE_COOKIE = 'gendernlsubscription';
export const AB_TESTING_OPEN_APP_EXPERIMENT_KEY = 'wyAKtbB7Q8e836hHBGJnag';
//export const AB_TESTING_ARTICLESHOW_CONTROL_GROUP_PERCENT = 25;
//export const AB_TESTING_ARTICLESHOW_RANGE = 75;

export const MOB_DEFAULT_INTERSTITIAL_URL_PROD =
  'https://m.timesofindia.com/elections/defaultinterstitial_js_react/minify-1,v-5.cms';
export const MOB_DEFAULT_INTERSTITIAL_URL_DEV =
  'https://spmdev.timesofindia.com/elections/defaultinterstitial_js_react/minify-1,v-5.cms';
export const MOB_DEFAULT_INTERSTITIAL_US_URL_PROD =
  'https://m.timesofindia.com/elections/defaultinterstitial_js_react_us_hp/minify-1,v-2.cms';
export const MOB_DEFAULT_INTERSTITIAL_US_URL_DEV =
  'https://spmdev.timesofindia.com/elections/defaultinterstitial_js_react_us_hp/minify-1,v-2.cms';
export const dimensionMapping = {
  dimension1: 'journalistName',
  dimension2: 'optimizelyTOICheck',
  dimension3: 'articleId',
  dimension4: 'authorName',
  dimension5: 'agency',
  dimension6: 'contentType',
  dimension7: 'clientId',
  dimension8: 'section',
  dimension9: 'template',
  dimension10: 'primeStatus',
  dimension11: 'paytmWidget',
  dimension12: 'evergreenStory',
  dimension13: 'network',
  dimension14: 'hpv2WAP',
  dimension15: 'perpetualArticle',
  dimension16: 'city',
  dimension17: 'language',
  dimension18: 'toiPlusPlug',
  dimension19: 'loginSource',
  dimension20: 'featurePhone',
  dimension21: 'loginstatus',
  dimension22: 'userId',
  dimension23: 'covid19',
  dimension25: '__gaabtest',
  dimension33: 'planeName',
  dimension34: 'nudgeType',
};
export const IPL_MID_ARTICLE = 'ipl_mid_article';
export const PROMOTED_AMAZON_SLIDER = 'Amazon_sponsored';

export const GEO_CODE_MAPPINNG = {
  1: 'IN',
};

export const SLIKE_ADVIDEO_SECTIONS = ['ASTROLOGY'];
export const SPOTLIGHT_RHS_WDGTMAP = ['MEDIAWIRE', 'BRANDWIRE'];
export const ETIMES_SUBSCRIBE = {
  ENT:
    'https://timesofindia.indiatimes.com/newsletter/addsubscription/?status=1&adHoc=true&scheduletime=1&day=1&frequency=1&secName=All_Entertainment&secId=1081479906&nlid=1006&id=',
  TV:
    'https://timesofindia.indiatimes.com/newsletter/addsubscription/?status=1&adHoc=true&scheduletime=1&day=6&frequency=2&nlid=1018&id=',
  WEB_SERIES:
    'https://timesofindia.indiatimes.com/newsletter/addsubscription/?status=1&adHoc=true&scheduletime=2&day=6&frequency=2&nlid=1003&id=',
  LIFESTYLE:
    'https://timesofindia.indiatimes.com/newsletter/addsubscription/?status=1&adHoc=true&scheduletime=1&day=1&frequency=1&nlid=1004&id=',
};

export const slikeVPEvents = {
  _splVideoLoaded: 'onVideoLoaded',
  splVideoStarted: 'onVideoStarted',
  splVideoCompleted: 'onVideoCompleted',
  splVideoPaused: 'onVideoPauded',
  splVideoResumed: 'onVideoResumed',
  _splError: 'onError',
  splAdRequest: 'onAdRequest',
  splAdLoaded: 'onAdLoaded',
  splAdComplete: 'onAdComplete',
  splAdSkip: 'onAdSkip',
  splAdView: 'onAdView',
  splVideoFullscreenchange: 'onVideoFullscreenchange',
  splVolumeChange: 'onVolumeChange',
  splInit: 'onVideoReady',
  splAdError: 'onAdError',
};

export const videoEventsMap = {
  onVideoRequest: 'VIDEOREQUEST',
  onVideoLoadRequest: 'VIDEOLOADREQUEST',
  onVideoReady: 'VIDEOREADY',
  onVideoStarted: 'VIDEOVIEW',
  onVideoCompleted: 'VIDEOCOMPLETE',
  onAdRequest: 'ADREQUEST',
  onAdLoaded: 'ADLOADED',
  onAdComplete: 'ADCOMPLETE',
  onAdSkip: 'ADSKIP',
  onAdView: 'ADVIEW',
  onAdError: 'ADERROR',
  onVolumeChange: 'AUDIOPLAY',
  onVideoFullscreenchange: 'FULLSCREEN_ON',
  onError: 'ERROR',
  //VIDEOAUTOPLAY_TOGGLE: To Do : Need to check which spl events is linked to it
  //DIM_TOGGLE: To Do : Need to check which spl events is linked to it
};

export const NP_DOMAIN = __PROD__
  ? 'https://npcoins.indiatimes.com'
  : 'https://nprelease.indiatimes.com';

export const SUBSCRIPTION_STAGE_DOMAIN =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com'
    : 'https://stgsubs.timesofindia.com';

export const SUBSCRIPTION_AUTH_STAGE_DOMAIN =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://pauth.indiatimes.com'
    : 'https://stgpauth.indiatimes.com';

export const PRC_PRIME_API_DESKTOP =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://pauth.indiatimes.com/prime-auth/prime/status/setCookies'
    : 'https://stgpauth.indiatimes.com/prime-auth/prime/status/setCookies';

export const PRC_PRIME_API_MOB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://pauth.timesofindia.com/prime-auth/prime/status/setCookies'
    : 'https://stgpauth.timesofindia.com/prime-auth/prime/status/setCookies';

export const TOI_SUBS_PLAN_STATUS_WEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://pauth.indiatimes.com/prime-auth/web/prime/status?rspBody=true'
    : 'https://stgpauth.indiatimes.com/prime-auth/web/prime/status?rspBody=true';
export const TOI_SUBS_PLAN_STATUS_MWEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://pauth.indiatimes.com/prime-auth/mweb/prime/status?rspBody=true'
    : 'https://stgpauth.indiatimes.com/prime-auth/mweb/prime/status?rspBody=true';

export const TOI_SUBS_FETCH_ORDER_STATUS_WEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/subscriptions/order/web/fetch'
    : 'https://stgsubs.timesofindia.com/subscriptions/order/web/fetch';
export const TOI_SUBS_FETCH_ORDER_STATUS_MWEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/subscriptions/order/mweb/fetch'
    : 'https://stgsubs.timesofindia.com/subscriptions/order/mweb/fetch';

export const TOI_SUBS_FETCH_PLAN_STATUS_WEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://pauth.indiatimes.com/prime-auth/web/prime/status'
    : 'https://stgpauth.indiatimes.com/prime-auth/web/prime/status';

export const TOI_SUBS_FETCH_PLAN_STATUS_MWEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://pauth.indiatimes.com/prime-auth/mweb/prime/status'
    : 'https://stgpauth.indiatimes.com/prime-auth/mweb/prime/status';

export const TOI_SUBS_FETCH_PLANS_WEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/plan-manager/subscription/web/fetch?fv=745'
    : 'https://stgsubs.timesofindia.com/plan-manager/subscription/web/fetch?fv=745';
export const TOI_SUBS_FETCH_PLANS_MWEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/plan-manager/subscription/mweb/fetch?fv=745'
    : 'https://stgsubs.timesofindia.com/plan-manager/subscription/mweb/fetch?fv=745';

export const TOI_SUBS_CREATE_ORDER_WEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/subscriptions/order/web/create?fv=725'
    : 'https://stgsubs.timesofindia.com/subscriptions/order/web/create?fv=725';
export const TOI_SUBS_CREATE_ORDER_MWEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/subscriptions/order/mweb/create?fv=725'
    : 'https://stgsubs.timesofindia.com/subscriptions/order/mweb/create?fv=725';

export const TOI_SUBS_INITIATE_JUSPAY_SDK_WEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/subscriptions/order/web/initiate?fv=725'
    : 'https://stgsubs.timesofindia.com/subscriptions/order/web/initiate?fv=725';

export const TOI_SUBS_INITIATE_JUSPAY_SDK_MWEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://subs.timesofindia.com/subscriptions/order/mweb/initiate?fv=725'
    : 'https://stgsubs.timesofindia.com/subscriptions/order/mweb/initiate?fv=725';

export const TOI_SUBS_PLAN_TRANSLATION_WEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://plus.timesofindia.com/toi-feed/config/toiw/trans/planpage?lang=1&fv=745&theme=light'
    : 'https://nprelease.indiatimes.com/toi-feed/config/toiw/trans/planpage?lang=1&fv=745&theme=light';

export const TOI_SUBS_PLAN_TRANSLATION_MWEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://plus.timesofindia.com/toi-feed/config/toim/trans/planpage?lang=1&fv=745&theme=light'
    : 'https://nprelease.indiatimes.com/toi-feed/config/toim/trans/planpage?lang=1&fv=745&theme=light';

export const TOI_SUBS_COMMON_NUDGES_TRANSLATIONS_WEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://plus.timesofindia.com/toi-feed/config/toiw/trans/commonnudge?lang=1&fv=745&theme=light'
    : 'https://nprelease.indiatimes.com/toi-feed/config/toiw/trans/commonnudge?lang=1&fv=745&theme=light';

export const TOI_SUBS_COMMON_NUDGES_TRANSLATIONS_MWEB =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://plus.timesofindia.com/toi-feed/config/toim/trans/commonnudge?lang=1&fv=745&theme=light'
    : 'https://nprelease.indiatimes.com/toi-feed/config/toim/trans/commonnudge?lang=1&fv=745&theme=light';

export const TOI_PLUS_CONFIG_DOMAIN =
  LOGIN_MAPPED_ON_LIVE || __PROD__
    ? 'https://plus.timesofindia.com'
    : 'https://nprelease.indiatimes.com';

export const TOI_PLUS_ENABLING_CONDITIONS_API_WEB = `${TOI_PLUS_CONFIG_DOMAIN}/toi-feed/config/toiw/trans/master?fv=725`;

export const TOI_PLUS_ENABLING_CONDITIONS_API_MWEB = `${TOI_PLUS_CONFIG_DOMAIN}/toi-feed/config/toim/trans/master?fv=725`;

export const SUBSCRIPTION_PROD_DOMAIN = 'https://subs.timesofindia.com';
export const WEB_INDIA_HP_GA_CAT = 'WEB-IN-NHP1';
export const WAP_INDIA_HP_GA_CAT = 'MWEB-IN-NHP1';
export const GENDER_PLUS_SUBSCRIBE =
  'https://timesofindia.indiatimes.com/newsletter/addsubscription/?frequency=2&scheduletime=1&status=1&nlid=1039&adHoc=true&day=6&hostid=83&id=';

export const EXIT_POLL_FEED_URL =
  'https://toibnews.timesofindia.indiatimes.com/electionfeed/comapr2021/exit_json.htm';
export const EXIT_POLL_PR_AL_FEED_URL =
  'https://toibnews.timesofindia.indiatimes.com/electionfeed/comapr2021/pr_al_pg_json.htm';
export const EXIT_POLL_STAR_CND_FEED_URL =
  'https://toibnews.timesofindia.indiatimes.com/Election/election2017_starcnt.json';

export const PR_AL_FEED_URL =
  'https://toibnews.timesofindia.indiatimes.com/electionfeed/comapr2021/pr_al_pg_json.htm';
export const STAR_CND_FEED_URL =
  'https://toibnews.timesofindia.indiatimes.com/electionfeed/comapr2021/star_json.htm';

export const ELECTION_EXTRA_INFO_URL =
  '/electionwidget_extratext.cms?feedtype=sjson';

export const COVID_NL_COOKIE = 'covid19nlsubscription';

export const CORONAVIRUS_GA_CATEGORY = 'coronavirus_new';

export const NEWSLISTING_NL_COOKIE = 'newslistingsubscription';
export const NEWSLISTING_GA_CATEGORY = '-AL-city-';
export const CORONAVIRUS_CARDS_HOME_LITE_JSON_URL = __PROD__
  ? 'https://api-newscard.indiatimes.com/card-inserts/web/homepage_lite.json'
  : 'https://cards-staging.indiatimes.com/card-inserts/web/homepage_lite.json';

export const CARDS_ARTICLESHOW_JSON_URL = __PROD__
  ? 'https://api-newscard.indiatimes.com/article-show/'
  : 'https://cards-staging.indiatimes.com/article-show/';

export const CORONAVIRUS_CARDS_HOME_JSON_URL = __PROD__
  ? 'https://api-newscard.indiatimes.com/card-inserts/web/homepage.json'
  : 'https://cards-staging.indiatimes.com/card-inserts/web/homepage.json';

export const CORONAVIRUS_CARDS_HOME_US_LITE_JSON_URL = __PROD__
  ? 'https://api-newscard.indiatimes.com/card-inserts/web/us_lite.json'
  : 'https://cards-staging.indiatimes.com/card-inserts/web/us_lite.json';

export const CORONAVIRUS_CARDS_HOME_US_JSON_URL = __PROD__
  ? 'https://api-newscard.indiatimes.com/card-inserts/web/us.json'
  : 'https://cards-staging.indiatimes.com/card-inserts/web/us.json';

export const ENT_CITY_LIST_API =
  '/etimes_city_popup_feed_spadata.cms?feedtype=sjson';
export const ENT_CITY_TO_STATE_API =
  '/etimes_city_popup_feed_spadata.cms?feedtype=sjson&reqtype=citytostate&city_name=';
export const ENT_SEARCH_API = '/etimes/etsearchnewfeedspadata.cms?bycity=';
export const GEO_CITY_BY_LAT_LONG_API = `${ENT_CITY_LIST_API}`;
export const CORONAVIRUS_GRAPHS_JSON_URL = __PROD__
  ? 'https://api-newscard.indiatimes.com/card-inserts/web/coronavirus.json'
  : 'https://cards-staging.indiatimes.com/card-inserts/web/coronavirus.json';
export const OLYMPICS_CARDS_HOME_LITE_JSON_URL = __PROD__
  ? 'https://api-newscard.indiatimes.com/card-inserts/web/sports/tokyo-olympics-2021_lite.json'
  : 'https://cards-staging.indiatimes.com/card-inserts/web/sports/tokyo-olympics-2021_lite.json';

export const GET_US_SURVEY_QUESTION_LIST =
  'https://survey.indiatimes.com/times-survey/survey/question/getQList?accesskey=cfcd208495d565ef66e7dff9f98764da&surveyid=735';

export const POST_US_SURVEY_QUESTION_LIST =
  'https://survey.indiatimes.com/times-survey/survey/opinion/insert';

export const MAX_SURVEY_SHOW_LIMIT = 3;

export const US_SURVEY_COUNT = 'usSurveyCount';

export const US_SURVEY_SUBMITTED = 5;

const TIMES_CLUB_URL = 'https://timesofindia.indiatimes.com/times-club';

export const TIMES_CLUB_RHS_CTA = `${TIMES_CLUB_URL}?utm_source=TOI_web&utm_medium=TCpromo&utm_campaign=TC_rhs`;
export const TIMESCLUB_WIDGET_CTA_URLS = {
  MWEB: `${TIMES_CLUB_URL}?utm_source=TOI_mweb&utm_medium=TCpromo&utm_campaign=TC_popup`,
  WEB: `${TIMES_CLUB_URL}?utm_source=TOI_web&utm_medium=TCpromo&utm_campaign=TC_popup`,
};
export const TIMESCLUB_CTA_CAROUSEL = `${TIMES_CLUB_URL}?utm_source=TOI_web&utm_medium=TCpromo&utm_campaign=TC_car`;
export const TIMESCLUB_CTA_NAV = `${TIMES_CLUB_URL}?utm_source=TOI_mweb&utm_medium=TCpromo&utm_campaign=TC_L1`;

export const TOI_PLUS_SUBSCRIBE_COOKIE = 'toiplusSubscribeClose';
export const CLMB_WEB_CID = '2658:3';
export const CLMB_MWEB_CID = '2658:39';

export const TOI_PLUS_PLAN_PAGE_URL = '/toi-plus/plans';
