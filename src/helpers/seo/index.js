import React from 'react';
//import { format } from 'date-fns';
import PropTypes from 'prop-types';
import NavigationSchema from './getNavigationSchema';
import DynamicMetaTags from './DynamicMetaTags';
import { TOI_LIVE_DOMAIN, TOI_LIVE_MOBILE_DOMAIN } from '../../constants';

const getSeoFromData = seoData => {
  if (typeof seoData === 'object') {
    return {
      ...seoData,
      title: seoData.title,
      description: seoData.description,
      news_keywords: seoData.news_keywords,
    };
  }

  return {};
};

const appendDomainToURL = (url = '', mobile, singleURL, type) => {
  // liveblog handling
  if (singleURL) {
    return url;
  }

  if (url[0] === '/') {
    if (type === 'alternate') {
      if (mobile) {
        return TOI_LIVE_DOMAIN + url;
      }
      return TOI_LIVE_MOBILE_DOMAIN + url;
    }

    if (mobile) {
      return TOI_LIVE_MOBILE_DOMAIN + url;
    }
    return TOI_LIVE_DOMAIN + url;
  }
  if (type === 'alternate') {
    if (mobile) {
      if (url.indexOf('m.timesofindia.com') >= 0) {
        return url.replace('m.timesofindia.com', 'timesofindia.indiatimes.com');
      }
    } else if (url.indexOf('timesofindia.indiatimes.com') >= 0) {
      return url.replace('timesofindia.indiatimes.com', 'm.timesofindia.com');
    }
  } else if (mobile) {
    if (url.indexOf('timesofindia.indiatimes.com') >= 0) {
      return url;
    }
  } else if (url.indexOf('m.timesofindia.com') >= 0) {
    return url.replace('m.timesofindia.com', 'timesofindia.indiatimes.com');
  }

  return url;
};

class MetaTags extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    mobile: PropTypes.bool.isRequired,
    singleURL: PropTypes.bool.isRequired,
    preconnectDomains: PropTypes.arrayOf({}).isRequired,
    multipublish: PropTypes.bool,
    prevNextLinkForBot: PropTypes.shape({}),
    isMaxImagePreview: PropTypes.bool,
    isMaxVideoPreview: PropTypes.bool,
  };
  static defaultProps = {
    multipublish: false,
    prevNextLinkForBot: undefined,
    isMaxImagePreview: false,
    isMaxVideoPreview: false,
  };
  render() {
    const {
      data,
      multipublish,
      isMaxImagePreview,
      isMaxVideoPreview,
      mobile,
      singleURL,
      preconnectDomains,
      prevNextLinkForBot,
    } = this.props;
    const seoObject = (data && getSeoFromData(data)) || {};
    //const defaultDate = format(Date.now(), 'YYYY-MM-DDTHH:mm:ss+05:30');
    const canonicalURL = appendDomainToURL(
      seoObject.canonical,
      mobile,
      singleURL,
    );

    const alternateURL = seoObject.alternate
      ? appendDomainToURL(seoObject.alternate, mobile, singleURL, 'alternate')
      : null;

    const ogTitle = seoObject.ogtitle || seoObject.title;
    const ogdescription = seoObject.ogdescription || seoObject.description;
    return (
      <>
        <title>{seoObject.title}</title>
        <meta name="description" content={seoObject.description} />
        <meta name="keywords" content={seoObject.keywords} />
        <link rel="canonical" href={canonicalURL} />
        {seoObject.noindexnofollow && (
          <meta content="noindex, nofollow" name="robots" />
        )}
        {seoObject.geoRegion && (
          <meta name="geo.region" content={seoObject.geoRegion} />
        )}
        {seoObject.hreflang &&
          Array.isArray(seoObject.hreflang) &&
          seoObject.hreflang.map(element => (
            <link rel="alternate" href={element.url} hrefLang={element.lang} />
          ))}
        {seoObject.hreflang &&
          typeof seoObject.hreflang === 'string' && (
            <link
              rel="alternate"
              href={seoObject.hreflang}
              hrefLang="x-default"
            />
          )}
        {alternateURL && (
          <link
            rel="alternate"
            href={alternateURL}
            media={
              !this.props.mobile ? 'only screen and (max-width: 480px)' : ''
            }
          />
        )}
        {seoObject.alternateApp && (
          <link rel="alternate" href={seoObject.alternateApp} />
        )}
        {!multipublish &&
          (seoObject.amplink || seoObject.amphtml) && (
            <link rel="amphtml" href={seoObject.amplink || seoObject.amphtml} />
          )}
        {multipublish && <meta name="robots" content="noindex, nofollow" />}
        {isMaxImagePreview && (
          <meta name="robots" content="max-image-preview:large" />
        )}
        {isMaxVideoPreview && (
          <meta name="robots" content="max-video-preview:-1" />
        )}
        <DynamicMetaTags seoObject={seoObject} />
        <meta property="og:title" content={ogTitle} />
        <meta
          property="og:url"
          content={seoObject.desktopUrl || canonicalURL}
        />
        <meta property="og:image" content={seoObject.ogimage} />
        <meta property="og:description" content={ogdescription} />
        <meta
          property="twitter:url"
          content={seoObject.desktopUrl || canonicalURL}
        />
        <meta property="twitter:image" content={seoObject.ogimage} />
        <meta property="twitter:title" content={seoObject.title} />
        <meta property="twitter:description" content={seoObject.description} />
        <meta name="twitter:card" value="summary_large_image" />
        <meta name="twitter:site" value="@timesofindia" />
        <meta property="og:image:width" content="1070" />
        <meta property="og:image:height" content="580" />
        <meta name="mobile-web-app-capable" content="yes" />
        {seoObject.news_keywords && (
          <meta name="news_keywords" content={seoObject.news_keywords} />
        )}
        {prevNextLinkForBot &&
          prevNextLinkForBot.map(obj => <link rel={obj.key} href={obj.url} />)}
        {seoObject.expires && (
          <meta name="expires" content={seoObject.expires} />
        )}
        {seoObject.article && (
          <>
            <meta
              name="The Times of India"
              content={`app-id=427589329,app-argument=${seoObject.desktopUrl ||
                canonicalURL}`}
            />
            {/*<meta itemProp="inLanguage" content="en" />*/}
            <meta name="y_key" content="b1abb36a8d5c19c9" />
          </>
        )}
        {/*
        <meta
          itemProp="dateModified"
          content={seoObject.dateModified || defaultDate}
        />
        <meta
          itemProp="datePublished"
          content={seoObject.datePublished || defaultDate}
        />
        */}
        {seoObject.schema &&
          seoObject.schema.length > 0 &&
          seoObject.schema.map((item, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: item.data || item,
              }}
            />
          ))}

        <meta content="en" httpEquiv="content-language" />
        <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
        {/* <meta content="width=device-width,initial-scale=1.0" name="viewport" /> */}
        <meta content="#af2c2c" name="theme-color" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="true" name="HandheldFriendly" />
        <meta content="width" name="MobileOptimized" />
        <meta property="fb:pages" content="26781952138" />
        <meta property="fb:pages" content="227797153941209" />
        <meta
          content={
            seoObject['google-site-verification'] ||
            'ZgFICIedNvVZl5pV9EfAUeenwta9vBY0Za_GgmV4zuw'
          }
          name="google-site-verification"
        />
        <link
          href="https://static.asianetnews.com/v1/icons/default/apple-icon-57x57.png"
          rel="apple-touch-icon-precomposed"
        />
        <link
          href="https://static.asianetnews.com/v1/icons/default/apple-icon-57x57.png"
          sizes="72x72"
          rel="apple-touch-icon-precomposed"
        />
        <link
          href="https://static.asianetnews.com/v1/icons/default/apple-icon-57x57.png"
          sizes="114x114"
          rel="apple-touch-icon-precomposed"
        />
        <link
          href="https://static.asianetnews.com/v1/icons/default/apple-icon-57x57.png"
          sizes="144x144"
          rel="apple-touch-icon-precomposed"
        />
        <link href="//toiassets.indiatimes.com" rel="preconnect" crossOrigin />
        <link href="//toifeeds.indiatimes.com" rel="preconnect" />
        <link href="//www.googletagservices.com" rel="preconnect" />
        <link href="//partner.googleadservices.com" rel="preconnect" />
        <link href="//cm.g.doubleclick.net" rel="preconnect" />

        <link href="//securepubads.g.doubleclick.net" rel="preconnect" />
        <link href="//pubads.g.doubleclick.net" rel="preconnect" />
        <link href="//www.google-analytics.com" rel="preconnect" />
        <link href="//tpc.googlesyndication.com" rel="preconnect" />
        <link href="https://geoapi.indiatimes.com" rel="preconnect" />

        <link href="https://sb.scorecardresearch.com" rel="preconnect" />

        <link href="https://jssocdn.indiatimes.com" rel="preconnect" />
        <link href="https://jsso.indiatimes.com" rel="preconnect" />
        <link href="https://adservice.google.co.in" rel="preconnect" />
        <link href="//static.toiimg.com" rel="preconnect" />
        <link
          href="//toiassets.indiatimes.com"
          rel="dns-prefetch"
          crossOrigin
        />
        <link href="//toifeeds.indiatimes.com" rel="dns-prefetch" />
        <link href="//www.googletagservices.com" rel="dns-prefetch" />
        <link href="//partner.googleadservices.com" rel="dns-prefetch" />
        <link href="//cm.g.doubleclick.net" rel="dns-prefetch" />
        <link href="//securepubads.g.doubleclick.net" rel="dns-prefetch" />
        <link href="//pubads.g.doubleclick.net" rel="dns-prefetch" />
        <link href="//www.google-analytics.com" rel="dns-prefetch" />
        <link href="//tpc.googlesyndication.com" rel="dns-prefetch" />
        <link href="https://geoapi.indiatimes.com" rel="dns-prefetch" />
        <link href="https://sb.scorecardresearch.com" rel="dns-prefetch" />
        <link href="https://jsso.indiatimes.com" rel="dns-prefetch" />
        <link href="https://adservice.google.co.in" rel="dns-prefetch" />
        <link href="//static.toiimg.com" rel="dns-prefetch" />

        {preconnectDomains &&
          preconnectDomains.length > 0 &&
          preconnectDomains.map(domain => (
            <link href={domain} rel="preconnect" />
          ))}

        {seoObject.robots &&
          seoObject.robots.length > 0 && (
            <meta content={seoObject.robots} name="robots" />
          )}
        <link href="https://fastlane.rubiconproject.com" rel="preconnect" />
        <link
          crossOrigin="1"
          href="https://fastlane.rubiconproject.com"
          rel="preconnect"
        />
        <meta content="117787264903013" property="fb:app_id" />
        <meta content="The Times of India" property="og:site_name" />
        {typeof seoObject.sponsoredContentMeta !== 'undefined' &&
          seoObject.sponsoredContentMeta === '1.0' && (
            <meta property="cr:sponsored" />
          )}
        <meta content={seoObject.ogType || 'website'} property="og:type" />
      </>
    );
  }
}

export { getSeoFromData, MetaTags, NavigationSchema };
