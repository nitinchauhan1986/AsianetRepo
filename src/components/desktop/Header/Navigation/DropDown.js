import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import Image from 'components/Image';
import s from './DropDown.scss';

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getArticlesLayout(items, subItem, newga = '') {
    let html = '';
    if (items && items.length > 0) {
      html = items.map((values, index) => (
        <li key={values.id} className={s.listItem}>
          <Link
            to={values.wu}
            title={values.hl}
            className={s.listLink}
            data-ga={newga && `${newga}|Click_${index}/${values.wu}`}
          >
            {index === 0 || subItem ? (
              <>
                <div className={s.image}>
                  <div className={s.content}>
                    <Image
                      src={`https://static.toiimg.com/thumb/msid-${
                        values.imageid
                      },width-145,resizemode-4,imgsize-${values.imgsize}/${
                        values.imageid
                      }.jpg`}
                      title={values.hl}
                      alt=""
                    />
                  </div>
                </div>
                <span className={s.title}>{values.hl}</span>
              </>
            ) : (
              <>{values.hl}</>
            )}
          </Link>
        </li>
      ));
    }

    return html;
  }

  static getPhotosOrVideoLayout(items, isPhoto, newga = '') {
    let html = '';
    if (items && items.length > 0) {
      html = items.map((values, index) => (
        <li key={values.id} className={s.listItem}>
          <Link
            to={values.wu}
            className={`${s.listLink} ${isPhoto ? s.photo : s.video}`}
            data-ga={newga && `${newga}|Click_${index}/${values.wu}`}
          >
            <div className={s.image}>
              <div className={s.content}>
                <Image
                  src={`https://static.toiimg.com/thumb/msid-${
                    values.imageid
                  },width-145,resizemode-4,imgsize-${values.imgsize}/${
                    values.imageid
                  }.jpg`}
                  title={values.hl}
                  alt=""
                />
              </div>
            </div>
            <div className={s.details}>
              <i className={s.itemInfo}>{!isPhoto ? values.du : ''}</i>
              <span className={s.title}>{values.hl}</span>
            </div>
          </Link>
        </li>
      ));
    }

    return html;
  }

  render() {
    if (!this.props.data || !this.props.data.items) {
      return null;
    }

    let html = '';
    const { items } = this.props.data;
    if (this.props.type === 'list') {
      html = DropDown.getArticlesLayout(
        items,
        this.props.subItem,
        this.props.newga || '',
      );
    } else if (this.props.type === 'photo') {
      html = DropDown.getPhotosOrVideoLayout(items, true);
    } else if (this.props.type === 'video') {
      html = DropDown.getPhotosOrVideoLayout(items);
    }
    return (
      <ul
        className={`${s.dropdownList} ${this.props.subItem ? s.subitem : ''} ${
          this.props.type ? s[this.props.type] : ''
        }`}
      >
        {html}
      </ul>
    );
  }
}
DropDown.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  type: PropTypes.string,
  subItem: PropTypes.bool,
  newga: PropTypes.string,
};

DropDown.defaultProps = {
  type: 'list',
  subItem: false,
  newga: '',
};

export default DropDown;
