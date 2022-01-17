import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import CardV2 from 'components_v2/common/CardV2';
import s from './ElectionNews.scss';

class ElectionNews extends React.Component {
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
          {news.items &&
            Array.isArray(news.items[0]) &&
            news.items[0].map((item, index) => (
              <CardV2
                data={item}
                key={index}
                isVerticalTile
                newga={`click#${item.wu}#Election_Widget_Homepage`}
              />
            ))}
        </div>
      </React.Fragment>
    );
  }
}

ElectionNews.propTypes = {
  news: PropTypes.shape({}).isRequired,
};

export default ElectionNews;
