import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import s from './LinksList.scss';

class LinksList extends React.Component {
  render() {
    const {
      sectionData = { data: [] },
      gaCategory,
      gaAction,
      gaLabel,
    } = this.props;

    const { cssSelector } = this.props;
    const cssSelectorClass = s[cssSelector];

    return (
      <div className={`${s.trending} ${cssSelectorClass}`}>
        <div className={`${s.trending_list}`}>
          <ul>
            {sectionData.data &&
              sectionData.data.map((item, index) => (
                <li>
                  <Link
                    to={item.wu}
                    className="keyword"
                    data-ga={`${gaCategory}|${gaAction.replace(
                      '###index###',
                      index + 1,
                    )}|${(gaLabel && `${gaLabel}${item.hl}`) ||
                      `re_${item.hl}${item.wu && `_${item.wu}`}`}`}
                  >
                    {item.hl}
                  </Link>
                </li>
              ))}
          </ul>
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
  gaLabel: PropTypes.string,
};

LinksList.defaultProps = {
  cssSelector: '',
  gaCategory: 'TrendingTopics',
  gaAction: 'Click',
  gaLabel: '',
};
export default LinksList;
