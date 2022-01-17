import React from 'react';
// import axios from 'axios';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import Link from 'components/Link';
import s from './BudgetLinkout.scss';

// const isWapView = this.props;

class BudgetLinkout extends React.Component {
  render() {
    const { data, isWapView, cardcount } = this.props;
    // const cardno = cardcount;
    const settings = {
      // slidesToShow: cardno,
      slidesToScroll: 3,
      pauseOnHover: false,
      pauseOnFocus: false,
      dots: true,
      arrows: true,
      swipeToSlide: true,
      autoplay: false,
      draggable: false,
      // initialSlide,
      infinite: false,
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: cardcount || 5.1,
            slidesToScroll: cardcount || 5,
          },
        },
        {
          breakpoint: 1419,
          settings: {
            slidesToShow: cardcount || 7.1,
            slidesToScroll: cardcount || 7,
          },
        },
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: cardcount || 9,
            slidesToScroll: cardcount || 9,
          },
        },
      ],
    };

    return (
      <div className={s.externalLinks}>
        {!isWapView && (
          <Slider {...settings}>
            {data?.items?.map((value, index) => (
              <div key={index}>
                <Link
                  to={value.wu}
                  style={{ background: value.bgcolor }}
                  data-newga={`click#${value.hl}#Budget Widget`}
                >
                  <span className={`${s.thumbicon} ${s[value.classtype]}`} />
                  <span>{value.hl}</span>
                </Link>
              </div>
            ))}
          </Slider>
        )}
        {isWapView &&
          data?.items?.map((value, index) => (
            <Link
              key={index}
              to={value.wu}
              style={{ background: value.bgcolor }}
              data-newga={`click#${value.hl}#Budget Widget`}
            >
              <span className={`${s.thumbicon} ${s[value.classtype]}`} />
              <span className={s.text}>{value.hl}</span>
            </Link>
          ))}
      </div>
    );
  }
}

BudgetLinkout.propTypes = {
  isWapView: PropTypes.bool,
  cardcount: PropTypes.number,
  data: PropTypes.shape({
    items: PropTypes.shape({}),
  }),
};
BudgetLinkout.defaultProps = {
  isWapView: false,
  cardcount: '',
  data: {},
};

export default BudgetLinkout;
