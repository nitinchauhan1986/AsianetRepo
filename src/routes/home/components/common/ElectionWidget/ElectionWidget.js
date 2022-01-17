import React from 'react';
// import axios from 'axios';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import Link from 'components/Link';
import makeRequest from 'utils/makeRequest';
// eslint-disable-next-line no-unused-vars
import slickcss from 'slick-carousel/slick/slick.css';
import SocialSharingWeb from 'routes/articleshow_v2/components/desktop/SocialSharingWeb';
import SocialSharingMobile from 'routes/articleshow_v2/components/mobile/SocialSharingMobile';
import Loader from 'components/Loader';
//import ElectionPhotos from './ElectionPhotos';
import ElectionNews from './ElectionNews';
import { getExitPollDataForState } from './util';
import LiveblogUpdates from './LiveblogUpdates';
import ElectionState from './ElectionState';
// import ElectionBattle from './ElectionBattle';
import Infocus from '../../desktop/Infocus';
import s from './ElectionWidget.scss';
import AlliancePopup from './AlliancePopup';

const FEED_URL =
  'https://toibnews.timesofindia.indiatimes.com/electionfeed/comapr2021/exit_json.htm';
const PR_AL_FEED_URL =
  'https://toibnews.timesofindia.indiatimes.com/electionfeed/comapr2021/pr_al_pg_json.htm';
const STAR_CND_FEED_URL =
  'https://toibnews.timesofindia.indiatimes.com/electionfeed/comapr2021/star_json.htm';

const domain = __PROD__
  ? 'https://timesofindia.indiatimes.com'
  : 'https://toidev.indiatimes.com';
const ELECTION_EXTRA_INFO_URL = `${domain}/electionwidget_extratext.cms?feedtype=sjson`;

const settings = {
  slidesToShow: 3,
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

class ElectionWidget extends React.Component {
  constructor() {
    super();
    this.state = {
      electionData: {},
      starCandidateData: {},
      showAlliancePopup: false,
      extraInfo: {},
    };
  }
  componentDidMount() {
    const { isExitPoll, isIframeCssRequired } = this.props;
    if (isExitPoll) {
      fetchData(FEED_URL, this.setExitPollData);
    } else {
      fetchData(PR_AL_FEED_URL, this.setExitPollData);
      fetchData(STAR_CND_FEED_URL, this.setStarCndData);
    }
    if (!isExitPoll) {
      this.refreshData();
    }

    fetchData(ELECTION_EXTRA_INFO_URL, this.setExtaInfo);

    if (isIframeCssRequired === true) {
      import('./../../../../../scss_v2/base/_base.scss').then();
    }
  }

  refreshData = () => {
    const self = this;
    const { sectionData } = this.props;
    if (sectionData && sectionData.refreshinterval) {
      this.electionWidgetInterval = setInterval(() => {
        fetchData(PR_AL_FEED_URL, self.setExitPollData);
        fetchData(STAR_CND_FEED_URL, self.setStarCndData);
      }, sectionData.refreshinterval * 1000);
    }
  };

  componentWillUnmount() {
    clearInterval(this.electionWidgetInterval);
  }

  setExitPollData = data => {
    this.setState({ electionData: data });
  };

  setResultsData = data => {
    this.setState({ electionData: data });
  };

  setStarCndData = data => {
    this.setState({ starCandidateData: data });
  };

  setExtaInfo = data => {
    this.setState({ extraInfo: data });
  };

  setAlliancePopUpData = data => {
    this.setState({
      allianceMap: data,
      showAlliancePopup: !this.state.showAlliancePopup,
    });
    document.body.classList.toggle('disable-scroll');
  };

  toggleAllianceInfoPopup = () => {
    this.setState({ showAlliancePopup: !this.state.showAlliancePopup });
    document.body.classList.toggle('disable-scroll');
  };

  getFilteredStateData = data => {
    const { isExitPoll } = this.props;
    if (!isExitPoll) {
      return null;
    }
    return getExitPollDataForState(data);
  };

  getBreakingNews = () => {
    const { breakingnews } = this.props.sectionData;
    if (breakingnews && breakingnews[0] && breakingnews[0].path) {
      return (
        <h2 className={s.heading}>
          <Link
            to={breakingnews[0].path}
            data-newga={`click#${
              breakingnews[0].path
            }#Election_Widget_Homepage`}
            target="_blank"
          >
            {breakingnews[0].title}
          </Link>
        </h2>
      );
    }

    return <h2 className={s.heading}>{breakingnews[0].title}</h2>;
  };

  renderElectionstate = () => {
    const {
      electionData,
      starCandidateData,
      showAlliancePopup,
      allianceMap,
    } = this.state;
    const {
      sectionData,
      hideStarCandidate,
      hideLiveblog,
      isWapView,
      isIframeCssRequired,
      hideETheading,
    } = this.props;
    const { states } = sectionData;
    const isExitPoll = sectionData.exitpoll && sectionData.exitpoll === '1';

    if (
      !electionData ||
      typeof electionData !== 'object' ||
      Object.keys(electionData).length === 0
    ) {
      return (
        <div className={s.stateLoading}>
          <Loader />
        </div>
      );
    }

    return (
      <div className={s.stateContainer}>
        <Slider {...settings}>
          {states &&
            states.length > 0 &&
            states.map(state => (
              <ElectionState
                key={state.name}
                isExitPoll={isExitPoll}
                config={state}
                data={electionData[state.key || state.name]}
                isWapView={isWapView}
                setAlliancePopUpData={this.setAlliancePopUpData}
                sourceData={this.getFilteredStateData(
                  electionData[state.key || state.name],
                )}
                starCandidateData={
                  starCandidateData &&
                  starCandidateData[state.key || state.name]
                }
                hideStarCandidate={hideStarCandidate}
                hideLiveblog={hideLiveblog}
                isIframeCssRequired={isIframeCssRequired}
                hideETheading={hideETheading}
              />
            ))}
        </Slider>
        {isWapView &&
          showAlliancePopup && (
            <AlliancePopup
              allianceMap={allianceMap}
              toggleAllianceInfoPopup={this.toggleAllianceInfoPopup}
            />
          )}

        {!isExitPoll && (
          <span
            className={`${s.sourceText1} ${
              isIframeCssRequired && !hideETheading ? s.hide : ''
            }`}
          >
            Source: C-Voter
          </span>
        )}
      </div>
    );
  };

  render() {
    const {
      sectionData,
      isWapView,
      hideSharing,
      hideLiveblog,
      hideHeading,
      hideInfocus,
      isIframeCssRequired,
      hideETheading,
      isExitPoll,
    } = this.props;

    if (
      !sectionData ||
      typeof sectionData !== 'object' ||
      Object.keys(sectionData).length === 0
    ) {
      return null;
    }

    const { liveblog, news, keywords } = sectionData;

    const { extraInfo } = this.state;

    return (
      <div className={s.widgetContainer} ref={this.ref}>
        <div
          className={`${s.electionWidget} ${
            isIframeCssRequired ? s.iframe : ''
          }`}
        >
          <div className={s.electionHeader}>
            {isIframeCssRequired &&
              !hideETheading && (
                <div className={s.ETheader}>
                  <span className={s.ETheading}>
                    Assembly Elections 2021
                    {!isExitPoll && (
                      <span className={`${s.cvoter}`}>Source: C-Voter</span>
                    )}
                  </span>
                  <span className={s.logo}>
                    <img
                      src="https://static.toiimg.com/photo/82253493.cms"
                      alt=""
                    />
                  </span>
                </div>
              )}

            {((isIframeCssRequired && hideETheading) ||
              !isIframeCssRequired) && (
              <Link
                to={sectionData.path}
                className={s.tagLine}
                data-newga={`click#${
                  sectionData.path
                }#Election_Widget_Homepage`}
                target="_blank"
              >
                Assembly Elections 2021
              </Link>
            )}

            {!hideHeading && this.getBreakingNews()}
            {!isWapView &&
              !hideSharing && (
                <div className={`${s.share} share`}>
                  <SocialSharingWeb
                    title="Assembly Elections 2021: West Bengal, Tamil Nadu, Kerala, Assam, Puducherry Election Dates, Exit polls, opinion poll & results"
                    textRequired={false}
                    url="https://timesofindia.indiatimes.com/elections/assembly-elections"
                    disableShortUrl
                    linkeDin
                    via="@timesofindia"
                    gaAction="Click"
                    gaCategory="Election_Widget_Homepage"
                    topsticky
                    defaultEmailView
                  />
                </div>
              )}
          </div>

          <div className={s.electionInner}>
            {this.renderElectionstate()}
            {!isWapView &&
              !hideLiveblog && (
                <div className={s.twoColumn}>
                  <div className={s.left}>
                    <LiveblogUpdates
                      isWapView={isWapView}
                      liveblogData={liveblog}
                      storiesCount={3}
                    />
                  </div>
                  {!isWapView && (
                    <div className={s.right}>
                      <ElectionNews
                        news={news}
                        redirectionUrl="https://timesofindia.indiatimes.com/elections"
                      />
                      {/* {isExitPoll ? (
                        <ElectionNews
                          news={news}
                          redirectionUrl="https://timesofindia.indiatimes.com/elections"
                        />
                      ) : (
                        <ElectionPhotos
                          news={news}
                          redirectionUrl="https://timesofindia.indiatimes.com/elections"
                        />
                      )} */}
                    </div>
                  )}
                </div>
              )}
            {extraInfo &&
              extraInfo.text && (
                <div className={s.electionNote}>
                  <p className={s.noteText}>
                    <strong>Note: </strong>
                    {extraInfo.text}
                  </p>
                </div>
              )}
            {keywords &&
              !hideInfocus &&
              Array.isArray(keywords.items) &&
              Array.isArray(keywords.items[0]) && (
                <div className={s.infocus}>
                  <Infocus
                    // title={data.keywords.title}
                    title={keywords.title}
                    data={keywords.items[0]}
                    // data={data.keywords.items || data.keywords.data}
                    //data-newga="click#infocus#Budget Widget"
                    secname="Election_Widget_Homepage"
                  />
                </div>
              )}
          </div>
          {this.props.isWapView &&
            !hideSharing && (
              <SocialSharingMobile
                title="Assembly Elections 2021: West Bengal, Tamil Nadu, Kerala, Assam, Puducherry Election Dates, Exit polls, opinion poll and results"
                whatsAppShow
                isWapView
                gaAction="Click"
                isTablet={false}
                via="@timesofindia"
                gaCategory="Election_Widget_Homepage"
                url="https://timesofindia.indiatimes.com/elections/assembly-elections"
                wu="https://timesofindia.indiatimes.com/elections/assembly-elections"
                disableShortUrl
              />
            )}
        </div>

        {/* <div className={s.body}>


      <div className={s.right}>
        <div className={s.buttons}>button</div>

        <div className={s.social_icon_bar}>
          <SocialSharingMobile
            whatsAppShow
            isWapView
            isTablet={false}
            via="@timesofindia"
            gaCategory="Budget Widget"
            url={shareurl}
            wu={shareurl}
            disableShortUrl
          />
        </div>
      </div>
    </div> */}
      </div>
    );
  }
}

ElectionWidget.propTypes = {
  isWapView: PropTypes.bool,
  data: PropTypes.shape({
    items: PropTypes.shape({}),
  }),
  isExitPoll: PropTypes.bool,
  isIframeCssRequired: PropTypes.bool,
  hideETheading: PropTypes.bool,
};
ElectionWidget.defaultProps = {
  isWapView: false,
  data: {},
  isExitPoll: false,
  isIframeCssRequired: false,
  hideETheading: false,
};

export default ElectionWidget;
