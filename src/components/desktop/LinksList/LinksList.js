import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import Slider from 'react-slick';
import classNames from 'classnames';
import s from './LinksList.scss';

class LinksList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slickInfinite: false,
      slickArrows: false,
    };
  }
  componentDidMount() {
    this.setInfiniteForSlick();
    //if (window) window.addEventListener('resize', this.onWindowResize);
  }
  setInfiniteForSlick = () => {
    let allItemsWidth = 0;
    const totalWidth = this.slidesContainer
      ? this.slidesContainer.offsetWidth
      : 0;
    const slickSlideNodeList = this.slidesContainer.querySelectorAll(
      '.slick-slide',
    );
    const slickSlideNodeArr = Array.prototype.slice.call(slickSlideNodeList);
    slickSlideNodeArr.forEach(item => {
      allItemsWidth += item.offsetWidth + 15;
    });
    if (allItemsWidth > totalWidth) {
      this.setState({ slickInfinite: true, slickArrows: true });
    } else {
      this.setState({ slickInfinite: false, slickArrows: false });
    }
  };

  getItemGA = (itemText, index, wu) => {
    const { gaCategory, gaAction } = this.props;
    const gaWithCategoryAction =
      gaCategory && gaAction
        ? // ? `${gaCategory}|${gaAction}_${index}|${itemText}${wu && `_${wu}`}`
          `${gaCategory}|${gaAction}-${index}|${wu && wu}`
        : `TopSection-Actions|Click-TrendingTopics_${itemText}${wu &&
            `_${wu}`}/${index}`;
    return gaWithCategoryAction;
  };
  render() {
    const { sectionData } = this.props;
    const { items, data } = sectionData;
    const itemsList = data && data.length ? data : items;
    const settings = {
      className: 'slider variable-width',
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      arrows: this.state.slickArrows,
      infinite: this.state.slickInfinite,
    };

    const { cssSelector } = this.props;
    const cssSelectorClass = s[cssSelector];
    return (
      <div
        className={`${s.trending} ${cssSelectorClass}`}
        id={sectionData && sectionData.id === 'keywords' ? sectionData.id : ''}
      >
        <h3>{sectionData.name || sectionData.title}</h3>
        <div
          ref={el => {
            if (el) {
              this.slidesContainer = el;
            }
          }}
          className={`${s.trending_list} ${classNames({
            [s.slickinfinite]: this.state.slickInfinite,
            [`trending_list`]: this.state.slickArrows,
          })}`}
        >
          <Slider {...settings}>
            {itemsList &&
              itemsList.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.wu}
                  className="keyword"
                  data-ga={`${this.getItemGA(item.hl, index + 1, item.wu)}`}
                  target={item.target === '_blank' ? item.target : ''}
                >
                  {item.hl}
                </Link>
              ))}
          </Slider>
        </div>
      </div>
    );
  }
}

LinksList.propTypes = {
  sectionData: PropTypes.shape({}).isRequired,
  cssSelector: PropTypes.string,
  gaCategory: PropTypes.string,
  gaAction: PropTypes.string,
};

LinksList.defaultProps = {
  cssSelector: '',
  gaCategory: '',
  gaAction: '',
};
export default LinksList;
