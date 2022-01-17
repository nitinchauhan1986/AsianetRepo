import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import Link from 'components/Link';
import s from './BudgetCheaperDearer.scss';

const CONST_MAP = {
  Cheaper: 'cheaper',
  Dearer: 'dearer',
};
class BudgetCheaperDearer extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'cheaper',
    };
  }

  getClassName(tab) {
    const { activeTab } = this.state;
    return tab === activeTab ? s.active : '';
  }

  setActiveTab = activeTab => {
    this.setState({ activeTab });
  };

  render() {
    const { cheaper, dearer } = this.props;
    const { activeTab } = this.state;
    const settings = {
      slidesToShow: 1.2,
      slidesToScroll: 1,
      pauseOnHover: false,
      pauseOnFocus: false,
      dots: true,
      arrows: true,
      swipeToSlide: true,
      autoplay: false,
      draggable: false,
      // initialSlide,
      infinite: false,
    };

    // const items = data.items;
    // const [, , cheaper, dearer] = items;

    return (
      <div className={s.cdwrapper}>
        <div className={s.tophead}>
          <div className={s.tabs}>
            <span
              className={this.getClassName(CONST_MAP.Cheaper)}
              onClick={() => this.setActiveTab(CONST_MAP.Cheaper)}
            >
              Cheaper
            </span>
            <span
              className={this.getClassName(CONST_MAP.Dearer)}
              onClick={() => this.setActiveTab(CONST_MAP.Dearer)}
            >
              Dearer
            </span>
          </div>
          <Link
            to={cheaper.wu}
            className={s.viewall}
            data-ga="Budget Widget|click|Cheaper Dearer"
          >
            View All
          </Link>
        </div>
        {activeTab && (
          <div className={s.slider}>
            <div
              className={` ${s.cheapercontent} ${this.getClassName(
                CONST_MAP.Cheaper,
              )}`}
            >
              <Slider {...settings}>
                {cheaper?.items?.map((value, index) => (
                  <div className={s.sliderItems} key={index}>
                    <div className={s.itemTop}>
                      <h3>{value.hl}</h3>
                      <img
                        src={`https://static.toiimg.com/photo/${
                          value.imageid
                        }.cms`}
                        alt={value.hl}
                      />
                    </div>
                    <p>{value.syn}</p>
                  </div>
                ))}
              </Slider>
            </div>
            <div
              className={`${s.dearercontent} ${this.getClassName(
                CONST_MAP.Dearer,
              )}`}
            >
              <Slider {...settings}>
                {dearer?.items?.map((value, index) => (
                  <div className={s.sliderItems} key={index}>
                    <div className={s.itemTop}>
                      <h3>{value.hl}</h3>
                      <img
                        src={`https://timesofindia.indiatimes.com/photo/${
                          value.imageid
                        }.cms`}
                        alt={value.hl}
                      />
                    </div>
                    <p>{value.syn}</p>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
        <div className={s.view_all_link}>
          <Link
            to={cheaper.wu}
            className={s.viewall}
            data-ga="Budget Widget|click|Cheaper Dearer"
          >
            More Cheaper vs Dearer
          </Link>
        </div>
      </div>
    );
  }
}

BudgetCheaperDearer.propTypes = {
  // isWapView: PropTypes.bool,
  cheaper: PropTypes.shape({}),
  dearer: PropTypes.shape({}),
};
BudgetCheaperDearer.defaultProps = {
  // isWapView: false,
  cheaper: {},
  dearer: {},
};

export default BudgetCheaperDearer;
