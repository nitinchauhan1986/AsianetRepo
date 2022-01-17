import React from 'react';
// import axios from 'axios';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { format } from 'date-fns';
import { getMilliSecondsTimestamp } from 'utils/dateUtils';
import { gaWrapper } from 'helpers/analytics';
import { isScrolledIntoView } from 'utils/common';
import makeRequest from 'utils/makeRequest';
import AdCaller from 'helpers/ads/adCaller';
import Link from 'components/Link';
import Infocus from '../../desktop/Infocus';
import BudgetLinkout from './BudgetLinkout';
import BudgetCheaperDearer from './BudgetCheaperDearer';
// import SocialSharingMobile from '../../../../articleshow_v2/components/mobile/SocialSharingMobile';
import s from './BudgetWidgetHP.scss';

const defaultSkew = 500;
class BudgetWidgetHP extends React.Component {
  constructor() {
    super();
    this.ref = React.createRef();
    this.gaFired = false;
    this.state = {
      data: {},
    };
    this.timer = false;
  }

  componentDidMount() {
    const dataUrl = this.props.data.refreshUrl;
    this.throttledInView = throttle(this.checkDomIsInView.bind(this), 10);
    this.skew = this.props.skew || defaultSkew;
    window.addEventListener('scroll', this.throttledInView);
    this.timer = setInterval(() => {
      makeRequest.get(dataUrl).then(response => {
        const newdata = response;
        if (newdata) {
          this.setState({ data: newdata.data });
        }
      });
    }, 50000);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.throttledInView);
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  checkDomIsInView() {
    if (this.ref && this.ref.current && isScrolledIntoView(this.ref.current)) {
      this.sendGAEvent();
    }
  }

  sendGAEvent = () => {
    if (!this.gaFired) {
      gaWrapper(
        'send',
        'event',
        'Budget Widget',
        `Viewport`,
        window.location.href,
      );
      this.gaFired = true;
    }
  };

  renderBudgetDownload(link, heading) {
    return (
      <button
        className={`${s.buttonlinks}`}
        onClick={() => this.startBudgetDownload(link)}
      >
        {heading}
      </button>
    );
  }

  startBudgetDownload = link => {
    window.open(link);
    gaWrapper(
      'send',
      'event',
      'Budget Widget',
      `Download`,
      `Budget Full Speech`,
    );
  };

  render() {
    const { data, isWapView } = this.props;
    let shareurl = '';

    if (typeof window !== 'undefined') {
      shareurl = window.location.href;
    }

    if (typeof data !== 'undefined' && !data.items && !data.data) {
      return null;
    }
    let { lbg, linkout, sensex, cheaper, dearer, pdf } =
      data.items || data.data;

    if (
      typeof this.state.data !== 'undefined' &&
      typeof this.state.data.items !== 'undefined'
    ) {
      ({ lbg, linkout, sensex, cheaper, dearer, pdf } = this.state.data.items);
    }

    const calcDate = inputdate => {
      const validTimestamp = getMilliSecondsTimestamp(inputdate);
      const date = new Date(validTimestamp);
      const timestamp2 =
        validTimestamp + date.getTimezoneOffset() * 60 * 1000 + 330 * 60 * 1000;
      const readableTime = format(timestamp2, 'HH:mm [(IST)] MMM DD');
      return readableTime;
    };

    const netChangeClass = value =>
      // eslint-disable-next-line no-nested-ternary
      value > 0 ? s.up : value < 0 ? s.down : s.nochange;

    const netChange = value => (value > 0 || value < 0 ? value : 'No change ');
    return (
      <div className={s.widgetContainer} ref={this.ref}>
        <div className={s.head}>
          <Link
            to={data.path}
            className={s.logo}
            data-newga="click#logo#Budget Widget"
          >
            <img
              src="https://static.toiimg.com/photo/80591051.cms"
              alt="Budget 2021"
            />
          </Link>

          {isWapView &&
            typeof pdf !== 'undefined' &&
            this.renderBudgetDownload(pdf.wu, pdf.hl)}

          {!isWapView && <AdCaller data={data.ad} className={s.topbandad} />}
        </div>
        <div className={s.body}>
          {lbg.tn === 'lbg' && (
            <div className={`${s.liveblog}`}>
              {!isWapView && (
                <div className={s.blinker}>
                  <i className={`${s.liveBtn} ${s.red}`} />
                  <span>Live Now</span>
                </div>
              )}

              <div className={s.lbheading}>{lbg.title}</div>

              <div className={s.lbContent}>
                {lbg?.items?.map((value, index) => (
                  <div className={s.content} key={index}>
                    <div className={s.time}>
                      {isWapView && (
                        <div className={s.blinker}>
                          <i className={`${s.liveBtn} ${s.red}`} />
                        </div>
                      )}
                      <span>{calcDate(value.timestamp)}</span>
                    </div>
                    <div className={s.text}>{value.title}</div>
                  </div>
                ))}
              </div>
              <div className={s.moreupdate}>
                <Link
                  to={lbg.path}
                  data-newga="click#moreupdates#Budget Widget"
                >
                  {lbg.lbgcount} More Updates
                </Link>
              </div>
            </div>
          )}

          <div className={s.right}>
            {sensex?.tn === 'sensex' && (
              <div className={s.topdata}>
                <ul>
                  {sensex?.items?.map((value, index) => (
                    <li key={index}>
                      {value.name || value.category} <br />
                      <b>
                        {value.CurrentIndexValue ||
                          value.ClosePrice ||
                          value.bidprice}
                      </b>
                      <span
                        className={`${netChangeClass(
                          value.netChange || value.NetChange,
                        )}`}
                      >
                        {netChange(value.netChange || value.NetChange)}

                        <i className={s.arrow} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cheaper && (
              <BudgetCheaperDearer cheaper={cheaper} dearer={dearer} />
            )}

            {!cheaper &&
              !dearer &&
              linkout?.tn === 'linkoutslider' && (
                <BudgetLinkout
                  data={linkout}
                  isWapView={this.props.isWapView}
                  cardcount={3.1}
                />
              )}

            {!isWapView &&
              typeof pdf !== 'undefined' && (
                <div className={s.buttons}>
                  {this.renderBudgetDownload(pdf.wu, pdf.hl)}
                </div>
              )}

            {/* {isWapView && (
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
            )} */}
          </div>
        </div>
        {!isWapView && (
          <div className={s.infocus}>
            <Infocus
              title={data.keywords.title}
              data={data.keywords.items || data.keywords.data}
              data-newga="click#infocus#Budget Widget"
              secname="Budget_widget_Infocus"
            />
          </div>
        )}
      </div>
    );
  }
}

BudgetWidgetHP.propTypes = {
  isWapView: PropTypes.bool,
  data: PropTypes.shape({
    items: PropTypes.shape({}),
    data: PropTypes.shape({}),
    refreshUrl: PropTypes.string,
    path: PropTypes.string,
  }),
  skew: PropTypes.string,
};
BudgetWidgetHP.defaultProps = {
  isWapView: false,
  data: {},
  skew: undefined,
};

export default BudgetWidgetHP;
