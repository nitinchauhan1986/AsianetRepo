import React from 'react';
// import axios from 'axios';
import PropTypes from 'prop-types';
// import Slider from 'react-slick';
import Link from 'components/Link';
import { dateToStringWithFormat } from 'utils/dateUtils';
import makeRequest from 'utils/makeRequest';
import s from './LiveblogUpdates.scss';

function fetchData(feedUrl, callback) {
  makeRequest
    .get(feedUrl, {}, 'skipfeedengine')
    .catch(err => console.log(err))
    .then(data => {
      if (
        data &&
        data.status === 200 &&
        data.data &&
        typeof callback === 'function'
      ) {
        callback(data.data);
      }
    });
}

class LiveblogUpdates extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (
      this.props &&
      this.props.liveblogData &&
      this.props.liveblogData.refreshinterval
    ) {
      this.refreshData();
    }
  }

  refreshData = () => {
    this.electionWidgetInterval = setInterval(() => {
      fetchData(this.props.liveblogData.dataUrl, data => {
        if (data && data.data) {
          this.setState({
            liveblogData: {
              news: {
                items: [...data.data.contents],
                lbgcount: data.data.totalCount,
                title: data.title1,
                lastupd: data.lastupd,
              },
              path: this.props.liveblogData.path,
            },
          });
        }
      });
    }, this.props.liveblogData.refreshinterval * 1000);
  };

  componentWillUnmount() {
    clearInterval(this.electionWidgetInterval);
  }

  renderStory = () => {
    let { liveblogData = {} } = this.state;
    if (!liveblogData.news) {
      liveblogData = Object.assign({}, this.props.liveblogData);
    }
    const { isWapView, storiesCount, hideContent } = this.props;
    const { news } = liveblogData;
    const { items } = news;
    return (
      <>
        <div className={`${s.lbheading} lbheading`}>{news.title}</div>
        {!isWapView &&
          !hideContent && (
            <div className={s.lbContentscrollcontent}>
              {Array.isArray(items) &&
                items.map(
                  (story, index) =>
                    index < storiesCount ? (
                      <div className={s.lbContent} key={index}>
                        <div className={s.content}>
                          <div className={s.time}>
                            <span>
                              {dateToStringWithFormat(
                                story.timestamp,
                                'HH:mm [(IST)] MMM DD',
                              )}
                            </span>
                          </div>
                          <div className={s.text}>{story.title}</div>
                        </div>
                      </div>
                    ) : null,
                )}
            </div>
          )}
      </>
    );
  };

  render() {
    let { liveblogData = {} } = this.state;
    const { gaCategory, themeClass } = this.props;
    if (!liveblogData.news) {
      liveblogData = Object.assign({}, this.props.liveblogData);
    }
    const { path, news } = liveblogData;
    if (!news || !Array.isArray(news.items)) {
      return null;
    }

    let isLiveblogActive = false;
    if (liveblogData && liveblogData.news.lastupd) {
      isLiveblogActive =
        Date.now() - liveblogData.news.lastupd * 1000 < 1 * 60 * 60 * 1000;
    }

    return (
      <div
        className={`${s.liveblog} ${!isLiveblogActive ? s.LBnotactive : ''} ${
          themeClass ? s.electionTheme : ''
        }`}
      >
        {isLiveblogActive && (
          <div className={s.blinker}>
            <i className={`${s.liveBtn} ${s.red}`} />
            {!themeClass && <span>Live Now</span>}
          </div>
        )}
        {this.renderStory()}
        <div className={`${s.moreupdate} moreupdate`}>
          <Link
            to={path}
            data-newga={`click#${path}#${gaCategory ||
              'Election_Widget_Homepage'}`}
            target="_blank"
          >
            {news.lbgcount} More Updates
          </Link>
        </div>
      </div>
    );
  }
}

LiveblogUpdates.propTypes = {
  // themeClass: PropTypes.bool,
  // hideHeader: PropTypes.bool,
  data: PropTypes.shape({
    items: PropTypes.shape({}),
  }),
  gaCategory: PropTypes.string,
};
LiveblogUpdates.defaultProps = {
  // themeClass: false,
  // hideHeader: false,
  data: {},
  gaCategory: '',
};

export default LiveblogUpdates;
