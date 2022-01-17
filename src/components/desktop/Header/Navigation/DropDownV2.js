import React from 'react';
import PropTypes from 'prop-types';
// import Link from 'components/Link';
// import Image from 'components/Image';
import CardListV5 from 'components_v2/common/CardListV5';
import s from './DropDown.scss';

class DropDownV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getColumnLayout(items, newga = '') {
    let html = '';
    const colItems = [[]];
    items.forEach((item, i) => {
      const index = i + 1;
      colItems[colItems.length - 1].push(item);
      if (index + 1 > 3 && (index + 1) % 3 === 1 && index < items.length) {
        colItems.push([]);
      }
    });
    if (colItems && colItems.length > 0) {
      html = colItems.map((values, index) => (
        <div>
          <CardListV5
            data={values}
            featuredItemDisplay={{
              featuredIndex: 0,
              isVerticalTile: true,
            }}
            nonFeaturedDisplay={{
              hideImage: true,
              itemClass: 'linktype2',
              itemWrapperClass: '',
              textItemWrapperClass: '',
              listWrapperClass: '',
            }}
            newga={`${newga}#Column_${index + 1}_Click_`}
            //htmlKeys={item.htmlKeys}
            //key={`${sectionData.id}_${item.tn}`}
          />
        </div>
      ));
    }

    return html;
  }

  static getPhotosOrVideoLayout(items, newga = '') {
    let html = '';
    if (items && items.length > 0) {
      html = (
        <div className="grid_wrapper">
          <CardListV5
            data={items}
            nonFeaturedDisplay={{
              hideImage: false,
              isVerticalTile: true,
              itemClass: 'linktype2',
              itemWrapperClass: 'col_l_3 col_m_3',
              textItemWrapperClass: '',
              listWrapperClass: '',
            }}
            newga={`${newga}#Click_`}
            //htmlKeys={item.htmlKeys}
            //key={`${sectionData.id}_${item.tn}`}
          />
        </div>
      );
    }

    return html;
  }

  render() {
    if (!this.props.data || !this.props.data.items) {
      return null;
    }

    let html = '';
    const { items } = this.props.data;
    const { newga } = this.props;
    if (this.props.type === 'list') {
      html = DropDownV2.getColumnLayout(items, newga);
    } else if (this.props.type === 'photo') {
      html = DropDownV2.getPhotosOrVideoLayout(items, newga);
    } else if (this.props.type === 'video') {
      html = DropDownV2.getPhotosOrVideoLayout(items, newga);
    }
    return (
      <>
        {this.props.type === 'list' ? (
          <>{html}</>
        ) : (
          <ul
            className={`${s.dropdownList} ${
              this.props.subItem ? s.subitem : ''
            } ${this.props.type ? s[this.props.type] : ''}`}
          >
            {html}
          </ul>
        )}
      </>
    );
  }
}
DropDownV2.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  type: PropTypes.string,
  subItem: PropTypes.bool,
  newga: PropTypes.string,
};

DropDownV2.defaultProps = {
  type: 'list',
  subItem: false,
  newga: '',
};

export default DropDownV2;
