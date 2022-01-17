/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import analyticsWrapper from 'helpers/analytics/analyticsWrapper';
import Link from 'components/Link';
// eslint-disable-next-line no-unused-vars
import makeRequest from 'utils/makeRequest';
// import slickcss from 'slick-carousel/slick/slick.css';
import InterSectionBorder from 'components_v2/common/InterSectionBorder';
import classNames from 'classnames';
import s from './CoronaHomePageWidget.scss';

const settings = {
  slidesToShow: 2,
  slidesToScroll: 1,
  className: 'slider variable-width',
  pauseOnHover: false,
  pauseOnFocus: false,
  dots: false,
  arrows: true,
  swipeToSlide: true,
  autoplay: false,
  draggable: false,
  infinite: false,
  variableWidth: true,
  lazyLoad: false,
  responsive: [
    {
      breakpoint: 999,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],
};
const tabSettings = {
  dots: false,
  arrows: false,
  swipeToSlide: true,
  autoplay: false,
  draggable: false,
  infinite: false,
  variableWidth: true,
  lazyLoad: false,
  responsive: [
    {
      breakpoint: 999,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],
};

const iterateObjects = (cards, isWapView) => {
  const arrayCardsElements = [];
  for (const property in cards) {
    arrayCardsElements.push(
      <div
        id={cards[property].card_id}
        style={{ width: `${isWapView ? '300px' : '360px'}` }}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: cards[property].iframe,
        }}
      />,
    );
  }
  return arrayCardsElements;
};
const scrollIntoView = (event, slidesContainer, isWapView) => {
  const { left, width } = event.currentTarget.getBoundingClientRect();
  const totalWidth = width + 24;
  let parentEl;
  if (isWapView) {
    parentEl = slidesContainer.current;
  } else {
    parentEl = slidesContainer.current.querySelector('.slick-list');
  }
  const parentWrapper = parentEl.getBoundingClientRect();
  const leftPos = left - parentWrapper.left;
  const pos = leftPos + totalWidth - parentWrapper.width;
  const { scrollLeft } = parentEl;
  if (pos > 0) {
    parentEl.scrollLeft = scrollLeft + pos;
  }
  if (leftPos < 0) {
    parentEl.scrollLeft = scrollLeft + leftPos - 24;
  }
};
const filterCards = (
  event,
  val,
  filters,
  setCardList,
  index,
  setActiveTab,
  slidesContainer,
  isWapView,
) => {
  scrollIntoView(event, slidesContainer, isWapView);
  if (isWapView) {
    const cardsSlider =
      slidesContainer.current &&
      slidesContainer.current.parentElement.querySelector('.mobile-slider');
    cardsSlider.scrollLeft = 0;
  }
  const cardsList = filters.map(item => val[item]);
  setCardList(cardsList);
  const activeTab = [];
  activeTab[index] = true;
  setActiveTab(activeTab);
};
const renderTabs = (
  insertData,
  setCardList,
  slidesContainer,
  isWapView,
  setActiveTab,
  activeTab,
) => {
  const { default_filter, filters = [], cards = {} } = insertData || {};
  if (default_filter) {
    if (filters && filters.length) {
      const filterData = filters[0];
      const tabValues = (filterData && Object.keys(filterData)) || [];
      tabValues.splice(tabValues.indexOf(default_filter), 1);
      tabValues.unshift(default_filter);
      return tabValues.map((item, index) => (
        <div
          onClick={e =>
            filterCards(
              e,
              cards,
              filterData[item],
              setCardList,
              index,
              setActiveTab,
              slidesContainer,
              isWapView,
            )
          }
          className={`${s.tabs} ${activeTab[index] ? s.active_tab : ''}`}
        >
          {item}
        </div>
      ));
    }
    return <div className={`${s.active_tab} ${s.tabs}`}>{default_filter}</div>;
  }
  return null;
};
const setInfiniteForSlick = (slidesContainer, setTabSetting) => {
  let allItemsWidth = 0;
  const totalWidth = slidesContainer ? slidesContainer.current.offsetWidth : 0;
  const slickSlideNodeList = slidesContainer.current.querySelectorAll(
    '.slick-slide',
  );
  const slickSlideNodeArr = Array.prototype.slice.call(slickSlideNodeList);
  slickSlideNodeArr.forEach(item => {
    allItemsWidth += item.offsetWidth + 24;
  });
  let newTabSetting = {};
  if (allItemsWidth > totalWidth) {
    newTabSetting = { ...tabSettings, arrows: true, infinite: true };
  } else {
    newTabSetting = { ...tabSettings, arrows: false, infinite: false };
  }
  setTabSetting(newTabSetting);
};
const CoronaHomePageWidget = ({
  cardInserts: { cards = {} },
  cardInserts,
  isWapView,
  isUsHomepage,
  useContentVisibilty,
  apiUrl,
  enableSlider,
  sliderConfig,
}) => {
  // console.log("server")
  if (cardInserts && cardInserts.template_component_code === 'card-carousel') {
    const slidesContainer = useRef(null);
    const [cardList, setCardList] = useState(cards);
    const [insertData, setFilters] = useState(cardInserts);
    const [tabConfig, setTabSetting] = useState(tabSettings);
    const config = { ...settings, ...sliderConfig };
    const [activeTab, setActiveTab] = useState([true]);
    useEffect(() => {
      if (
        cardInserts &&
        cardInserts.slot_id === 'div-0' &&
        typeof window !== 'undefined'
      ) {
        analyticsWrapper(
          'ga',
          'send',
          'event',
          window.categoryForGA,
          'scroll_measure',
          'CovidHTE_top_View',
          {
            nonInteraction: 1,
          },
        );
      }
    }, []);
    useEffect(
      () => {
        if (apiUrl && insertData && insertData.default_filter) {
          const { slot_id } = insertData;
          makeRequest.get(apiUrl, {}, 'skipfeedengine').then(data => {
            if (data && data.data && data.data.inserts) {
              setFilters(data.data.inserts[slot_id]);
            }
          });
        }
      },
      [apiUrl],
    );
    useEffect(
      () => {
        if (!isWapView && insertData && insertData.default_filter) {
          setInfiniteForSlick(slidesContainer, setTabSetting);
        }
      },
      [insertData && insertData.filters && insertData.filters.length],
    );
    const intrinsicClass = classNames({
      [s.widget_intrinsic_height1]:
        cardInserts.sponsor_lead || cardInserts.sponsor_logo_url,
      [s.widget_intrinsic_height2]: !(
        cardInserts.sponsor_lead || cardInserts.sponsor_logo_url
      ),
    });

    if (cardList && typeof cardList === 'object') {
      return (
        <div className={s.carCMSdWrapper}>
          {cardInserts.slot_id !== 'div-0' &&
            !isWapView && <InterSectionBorder />}
          <div
            className={`${s.sliderWrapper} ${
              cardInserts.slot_id === 'div-0' ? s.nospacing : ''
            } ${isUsHomepage ? s.usbottommrg : ''}
            ${useContentVisibilty && intrinsicClass}
            `}
          >
            <div className={s.headContainer}>
              {cardInserts.headline !== '' && (
                <div
                  className={`${s.linkheading} ${
                    isUsHomepage ? s.uslinkheading : ''
                  }${cardInserts.is_live_event ? s.liveEvent : ''}`}
                >
                  {cardInserts.headline_url !== '' ? (
                    <Link
                      to={cardInserts.headline_url}
                      data-newga={`click_heading#${cardInserts.headline}`}
                      target="_blank"
                    >
                      {cardInserts.headline}
                    </Link>
                  ) : (
                    cardInserts.headline
                  )}
                </div>
              )}
              {cardInserts.is_live_event && (
                <span className={s.livetxt}>Live</span>
              )}
              {!isWapView &&
                (cardInserts.sponsor_lead || cardInserts.sponsor_logo_url) && (
                  <div className={s.ads}>
                    {cardInserts.sponsor_lead && (
                      <span>{cardInserts.sponsor_lead}</span>
                    )}
                    {cardInserts.sponsor_logo_url && (
                      <a
                        href={cardInserts.sponsor_cta_url}
                        rel="nofollow noopener noreferrer"
                        target="_blank"
                      >
                        <img alt="covid" src={cardInserts.sponsor_logo_url} />
                      </a>
                    )}
                  </div>
                )}
            </div>

            {/* //IFRAMES CAROUSEL LOGIC when or not start carousel */}
            {insertData &&
              insertData.default_filter && (
                <div className={s.tabSlider} ref={slidesContainer}>
                  {!isWapView &&
                  insertData.filters &&
                  insertData.filters.length ? (
                    <Slider {...tabConfig}>
                      {renderTabs(
                        insertData,
                        setCardList,
                        slidesContainer,
                        isWapView,
                        setActiveTab,
                        activeTab,
                      )}
                    </Slider>
                  ) : (
                    <>
                      {renderTabs(
                        insertData,
                        setCardList,
                        slidesContainer,
                        isWapView,
                        setActiveTab,
                        activeTab,
                      )}
                    </>
                  )}
                </div>
              )}
            <div
              className={s.slickSlider}
              data-scrollga={
                cardInserts.slot_id !== 'div-0'
                  ? `${`CovidHTE_top_${cardInserts &&
                      cardInserts.template_component_code}`}`
                  : ''
              }
            >
              {(Object.keys(cardList).length > 3 && !isWapView) ||
              enableSlider ? (
                <Slider {...config}>{iterateObjects(cardList)}</Slider>
              ) : (
                <div className={`${s.dataItemWrapper} mobile-slider`}>
                  {iterateObjects(cardList, isWapView)}
                </div>
              )}
            </div>

            {isWapView && (
              <div className={s.headContainer}>
                {(cardInserts.sponsor_lead || cardInserts.sponsor_logo_url) && (
                  <div className={s.ads}>
                    {cardInserts.sponsor_lead && (
                      <span>{cardInserts.sponsor_lead}</span>
                    )}
                    {cardInserts.sponsor_logo_url && (
                      <a
                        href={cardInserts.sponsor_cta_url}
                        rel="nofollow noopener noreferrer"
                        target="_blank"
                      >
                        <img alt="covid" src={cardInserts.sponsor_logo_url} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {cardInserts.slot_id === 'div-0' &&
            !isWapView && <InterSectionBorder />}
        </div>
      );
    }
    return null;
  }
  return null;
};

CoronaHomePageWidget.propTypes = {
  cardInserts: PropTypes.shape({
    slot_id: PropTypes.string,
    headline: PropTypes.string,
    headline_url: PropTypes.string,
    cards: PropTypes.shape({}),
    template_component_code: PropTypes.string,
    sponsor_lead: PropTypes.string,
    sponsor_logo_url: PropTypes.string,
    sponsor_cta_url: PropTypes.string,
  }),
  apiUrl: PropTypes.string,
  isWapView: PropTypes.bool,
  isUsHomepage: PropTypes.bool,
  useContentVisibilty: PropTypes.bool,
};

CoronaHomePageWidget.defaultProps = {
  cardInserts: {},
  apiUrl: null,
  isWapView: false,
  isUsHomepage: false,
  useContentVisibilty: false,
};

export default CoronaHomePageWidget;
