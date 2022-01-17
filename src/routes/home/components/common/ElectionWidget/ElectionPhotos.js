/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import CardV2 from 'components_v2/common/CardV2';
import Slider from 'react-slick';
import s from './ElectionPhotos.scss';
// eslint-disable-next-line import/first
import slickcss from 'slick-carousel/slick/slick.css';

const settings = {
  slidesToShow: 2,
  slidesToScroll: 2,
  pauseOnHover: false,
  pauseOnFocus: false,
  dots: true,
  arrows: true,
  swipeToSlide: true,
  autoplay: false,
  draggable: false,
  infinite: false,
  responsive: [
    {
      breakpoint: 481,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],
};

class ElectionPhotos extends React.Component {
  render() {
    const { news, redirectionUrl } = this.props;
    return (
      <React.Fragment>
        <h2 className={s.newsHeading}>
          <Link
            href={redirectionUrl}
            data-newga={`click#${redirectionUrl}#Election_Widget_Homepage`}
            target="_blank"
          >
            {news.title}
          </Link>
        </h2>
        <div className={s.newsWrapper}>
          <Slider {...settings}>
            {news &&
              news.news &&
              Array.isArray(news.news.items) &&
              news.news.items.map(item => (
                <CardV2
                  data={item}
                  key={item.wu}
                  isPhotoVisualStory
                  newga={`click#${item.wu}#Election_Widget_Homepage`}
                />
              ))}
          </Slider>
        </div>
      </React.Fragment>
    );
  }
}

ElectionPhotos.propTypes = {
  news: PropTypes.shape({}).isRequired,
};

export default ElectionPhotos;
