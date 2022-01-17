import React from 'react';
import PropTypes from 'prop-types';
import Image from 'components/Image';
import { getImageFromImageObject } from 'components/Image/utils';
import Link from 'components/Link';
import { convertHtmlToStringText } from 'utils/common';
import classNames from 'classnames';
import s from './Card.scss';

function renderIcon(
  isPhotoStory,
  isTypeVideo,
  duration,
  photosCount,
  isInlineSmallIconCard,
  isMobileInlineVideo,
  isPrimeStory,
) {
  let iconData = '';
  let iconSize;
  const iconClassName = classNames({
    //provides layout
    [s.mediavideothumb]: isTypeVideo,
    [s.mediaphotothumb]: isPhotoStory,
    [s.toiPrime]: isPrimeStory,
  });

  const cardImageIcon = classNames({
    [s.newsVideo]: isTypeVideo,
    [s.newsPhoto]: isPhotoStory,
    [s.toiplusIcon]: isPrimeStory,
  });

  if (isPhotoStory) {
    iconData = photosCount;
  } else if (isTypeVideo) {
    iconData = duration;
  }
  if (!isInlineSmallIconCard) {
    iconSize = 'largeIcon';
  } else if (isMobileInlineVideo || isInlineSmallIconCard) {
    iconSize = 'smallIcon';
  }

  return iconSize === 'largeIcon' ? (
    <i className={iconClassName}>{iconData}</i>
  ) : (
    <i className={cardImageIcon} />
  );
}
function customOnError(e) {
  // src changed to 1px so that backgorund takes over
  e.target.onerror = null;
  e.target.src = 'https://static.toiimg.com/photo/25581306.cms';
}

function Card(props) {
  const {
    data = {},
    showDescription,
    onClick,
    itemClass,
    linkData,
    htmlKeys,
    shouldNotlazyloadImage,
    imgFit,
    imgWidth = '600',
    cssObj: { figureClass = '', imgCont = '', titleCont = '' } = {},
  } = props;
  const { imageid = '', du: duration, photosCount } = data;
  const { image = {} } = data;
  image.width = imgWidth;

  const imageSrc = getImageFromImageObject(image) || imageid.split('&')[0]; //this is temporary will be removed later

  const {
    isLeadImageNews, // for cover layout
    isLeadTypeTwo, //lead for City, Business
    //isLeadTypeThree, // for Desktop "Lifestyle section" only
    isLeadVideo,
    showSectionName,
    //photoWidget, //for Mobile "Photos" section
    //videoWidget, //for Mobile "Videos" section
    isMobileInlineVideo,
    isInlineSmallIconCard,
    isLeadPhoto,
    isVerticalTile,
    isPhotoWidget, // for Desktop "photo" widget only
    isVideoWidget, // for Desktop "Videos" widget only
    timeStampHtml,
    isPrimeStory,
  } = props;
  const isTypeVideo =
    data.hasVideo ||
    data.hasvideo ||
    data.type === 'video' ||
    data.tn === 'video' ||
    isMobileInlineVideo;
  const isPhotoStory = data.type === 'photostory' || data.tn === 'photostory';
  const isIconNeeded = isPhotoStory || isTypeVideo || isPrimeStory;
  const figureClassName = classNames({
    [s.card]: true,
    [s.leadthumb]: isLeadImageNews || isLeadVideo || isLeadPhoto,
    [s.leadthumb2]: isLeadTypeTwo,
    [s.mediathumb]: isVerticalTile || isPhotoWidget, // || isLeadTypeThree,
    [s.photoWidget]: isPhotoWidget,
    [s.videoWidget]: isVideoWidget,
    [s.videomediathumb]: isMobileInlineVideo && isVerticalTile,
    //[s.leadthumb3]: isLeadTypeThree,
  });
  const contentVisibilityClass = classNames({
    [s.card_intrinsic_size]: isInlineSmallIconCard,
    [s.video_card_intrinsic_size]: isMobileInlineVideo && isVerticalTile,
    [s.leadthumb_intrinsic_size]:
      isLeadImageNews || isLeadVideo || isLeadPhoto || isLeadTypeTwo,
  });
  const cardInner = classNames({
    [s.cardwrapper]: true,
    // [s.vdocard]: videoWidget,
    // [s.photocard]: photoWidget,
  });

  /* const leadPhotostoryVideoClass = classNames({
    [s.leadPhotostoryVideoClass]: isLeadImageNews && isTypeVideo && isPhotoStory,
  }); */

  let leadPhotostoryVideoClass = '';
  if (isLeadImageNews && (isTypeVideo || isPhotoStory)) {
    leadPhotostoryVideoClass = 'leadPhotostoryVideoClass';
  }

  let titleContainerClass;
  if (isLeadTypeTwo) {
    titleContainerClass = s.details;
  } else if (isLeadVideo || isPhotoWidget) {
    titleContainerClass = s.titleWithIcon;
  }

  let headingTxt = data.hl;
  if (htmlKeys && htmlKeys instanceof Array && htmlKeys.indexOf('hl') > -1) {
    headingTxt = convertHtmlToStringText(data.hl);
  }

  let descTxt = data.des;
  if (htmlKeys && htmlKeys instanceof Array && htmlKeys.indexOf('des') > -1) {
    descTxt = convertHtmlToStringText(data.des);
  }
  const shouldShowDescription = showDescription && typeof data.des === 'string';
  return (
    <figure
      className={`${figureClassName} ${itemClass} ${figureClass} ${props.useContentVisibilty &&
        contentVisibilityClass}`}
      key={data.id}
    >
      {showSectionName && (
        <div className={s.card_category}>
          <a href="a.com">TECH</a>
        </div>
      )}
      <Link
        to={data.wu}
        className={cardInner}
        onClick={onClick}
        data={linkData}
        data-newga={props.newga}
      >
        {imageSrc && (
          <div
            className={`${s.cardimage} ${leadPhotostoryVideoClass} ${imgCont}`}
          >
            <div className={`${s.content} cardactive`}>
              {/* This is to show live button on imagetop in case of live story */}
              {props.showLiveBtn && data.type === 'liveblog' ? (
                <div className={s.liveBtn}>Live</div>
              ) : null}
              <Image
                key={data.id}
                width={imgWidth}
                src={imageSrc}
                placeHolderSrc="https://static.toiimg.com/photo/msid-25581306/25581306.jpg"
                alt={headingTxt}
                lazyload={!shouldNotlazyloadImage}
                onError={customOnError}
                offsetVertical={300}
                className={classNames({
                  [s[`fit_${imgFit}`]]: imgFit,
                })}
              />
            </div>
            {isIconNeeded &&
              !(isLeadVideo || isPhotoWidget) &&
              renderIcon(
                isPhotoStory,
                isTypeVideo,
                duration,
                photosCount,
                isInlineSmallIconCard,
                isMobileInlineVideo,
                isPrimeStory,
              )}
          </div>
        )}

        {isLeadTypeTwo || (isLeadVideo || isPhotoWidget) ? (
          <div className={`${titleContainerClass} ${titleCont}`}>
            {(isLeadVideo || isPhotoWidget) &&
              renderIcon(
                isPhotoStory,
                isTypeVideo,
                duration,
                photosCount,
                isInlineSmallIconCard,
                isMobileInlineVideo,
              )}
            <figcaption>{headingTxt}</figcaption>
            {timeStampHtml && <p>{timeStampHtml}</p>}
            {shouldShowDescription && <p>{descTxt}</p>}
          </div>
        ) : (
          <>
            <figcaption
              className={`${titleCont} ${timeStampHtml ? 'is_timestamp' : ''}`}
            >
              {timeStampHtml ? <span>{headingTxt}</span> : <>{headingTxt}</>}
              {timeStampHtml && <p>{timeStampHtml}</p>}
            </figcaption>
            {shouldShowDescription && <p>{descTxt}</p>}
          </>
        )}
      </Link>
    </figure>
  );
}
Card.propTypes = {
  // mediatype: PropTypes.string,
  // description: PropTypes.string,
  data: PropTypes.shape({}).isRequired,
  isLeadImageNews: PropTypes.bool,
  isLeadTypeTwo: PropTypes.bool,
  //isLeadTypeThree: PropTypes.bool,
  isLeadVideo: PropTypes.bool,
  showSectionName: PropTypes.bool,
  //videoWidget: PropTypes.bool,
  onClick: PropTypes.func,
  //photoWidget: PropTypes.bool,
  isLeadPhoto: PropTypes.bool,
  isMobileInlineVideo: PropTypes.bool,
  isInlineSmallIconCard: PropTypes.bool,
  isVerticalTile: PropTypes.bool,
  isPhotoWidget: PropTypes.bool,
  isVideoWidget: PropTypes.bool,
  itemClass: PropTypes.string,
  showDescription: PropTypes.bool,
  showLiveBtn: PropTypes.bool,
  linkData: PropTypes.shape({}),
  newga: PropTypes.string,
  htmlKeys: PropTypes.arrayOf(PropTypes.string),
  shouldNotlazyloadImage: PropTypes.bool,
  imgFit: PropTypes.string,
  imgWidth: PropTypes.string,
  cssObj: PropTypes.shape({}),
  timeStampHtml: PropTypes.string,
  isPrimeStory: PropTypes.bool,
  useContentVisibilty: PropTypes.bool,
};
Card.defaultProps = {
  // mediatype: undefined,
  // description: undefined,
  isLeadImageNews: false,
  isLeadTypeTwo: false,
  //isLeadTypeThree: false,
  isLeadVideo: false,
  showSectionName: false,
  //videoWidget: false,
  isLeadPhoto: false,
  // photoWidget: false,
  onClick: undefined,
  isMobileInlineVideo: false,
  isInlineSmallIconCard: false,
  isVerticalTile: false,
  isPhotoWidget: false,
  isVideoWidget: false,
  itemClass: '',
  showDescription: false,
  showLiveBtn: false,
  linkData: undefined,
  newga: '',
  htmlKeys: [],
  shouldNotlazyloadImage: false,
  imgFit: undefined,
  imgWidth: '600',
  cssObj: {},
  timeStampHtml: null,
  isPrimeStory: false,
  useContentVisibilty: false,
};

export default React.memo(Card);
