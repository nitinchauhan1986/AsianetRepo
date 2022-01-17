import { TOI_SEO_DOMAIN, TOI_SITE_NAME } from '../../constants';

export const liveBlogSchemaShell = {
  '@context': 'https://schema.org',
  '@type': 'LiveBlogPosting',
  url: '',
  coverageStartTime: '',
  coverageEndTime: '',
  headline: '',
  description: '',
  image: {
    '@type': 'ImageObject',
    contentUrl:
      'https://timesofindia.indiatimes.com/thumb/msid-63780242,width-1200,height-900,resizemode-4/63780242.jpg',
    width: 1200,
    height: 900,
    url: 'https://static.toiimg.com/photo/msid-33550531/33550531.jpg',
  },
  datePublished: '',
  dateModified: '',
  keywords: '',
  publisher: {
    '@type': 'Organization',
    name: TOI_SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: 'https://static.toiimg.com/photo/msid-58127550/58127550.jpg',
      width: 600,
      height: 60,
    },
  },
  author: {
    '@type': 'Organization',
    sameAs: 'https://timesofindia.indiatimes.com#publisher',
    name: TOI_SITE_NAME,
  },
  about: {
    '@type': 'Event',
    name: '',
    startDate: '',
    description: '',
    endDate: '',
    eventAttendanceMode: 'mixed',
    eventStatus: 'Live',
    image: 'https://timesofindia.indiatimes.com/photo/78759192.cms',
    location: {
      address: 'India',
      name: 'India',
    },
  },
  liveBlogUpdate: [],
};
export const sampleLiveblogUpdate = {
  '@type': 'BlogPosting',
  headline: '',
  url: '',
  datePublished: '',
  image: {
    '@type': 'ImageObject',
    contentUrl:
      'https://timesofindia.indiatimes.com/thumb/msid-63780242,width-1200,height-900,resizemode-4/63780242.jpg',
    width: 1200,
    height: 900,
    url:
      'https://timesofindia.indiatimes.com/thumb/msid-63780242,width-1200,height-900,resizemode-4/63780242.jpg',
  },
  publisher: {
    '@type': 'Organization',
    name: TOI_SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: 'https://static.toiimg.com/photo/msid-58127550/58127550.jpg',
      width: 600,
      height: 60,
    },
  },
  author: {
    '@type': 'Organization',
    sameAs: 'https://timesofindia.indiatimes.com#publisher',
    name: TOI_SITE_NAME,
  },
  mainEntityOfPage: '',
  dateModified: '',
};

export const newsArticleSchema = {
  '@context': 'http://schema.org',
  '@type': 'NewsArticle',
  mainEntityOfPage: '',
  inLanguage: 'en',
  headline: '',
  keywords: '',
  url: '',
  description: '',
  datePublished: '',
  dateModified: '',
  articleBody: '',
  alternativeHeadline: '',
  author: {
    '@type': 'Organization',
    name: TOI_SITE_NAME,
  },
  publisher: {
    '@type': 'Organization',
    name: TOI_SITE_NAME,
    url: TOI_SEO_DOMAIN,
    logo: {
      '@type': 'ImageObject',
      url: 'https://static.toiimg.com/photo/msid-58127550/58127550.jpg',
      width: 600,
      height: 60,
    },
  },
  image: {
    '@type': 'ImageObject',
    url:
      'https://timesofindia.indiatimes.com/thumb/msid-63293722,width-1200,height-900,resizemode-4/63293722.jpg',
    height: 900,
    width: 1200,
  },
};
