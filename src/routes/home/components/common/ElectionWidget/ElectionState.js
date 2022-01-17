import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import classNames from 'classnames';
import LiveblogUpdates from './LiveblogUpdates';
import ElectionBattle from './ElectionBattle';
import s from './ElectionState.scss';
import RenderChart from '../Charts/RenderChart';
import AlliancePopup from './AlliancePopup';

class ElectionState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exitPollSource: [],
      selectedSource: '',
      // sortedPartyViewData: [],
      // sortedAllianceViewData: [],
      activeTab: 2,
      finalSourceData: {},
    };
  }
  componentDidMount() {
    const { sourceData, isExitPoll } = this.props;
    if (isExitPoll && sourceData && typeof sourceData === 'object') {
      const keys = Object.keys(sourceData);

      const finalKeys = [];
      const finalSourceData = {};
      keys.map(item => {
        const totalWonSeats = sourceData[item].reduce((total, source) => ({
          lsws: total.lsws + source.lsws,
        }));

        if (sourceData[item]) {
          finalSourceData[item] = JSON.parse(
            JSON.stringify(
              this.shiftOthToRight(
                this.getPartyListInSortedOrder(sourceData[item]),
              ),
            ),
          );
        }

        if (totalWonSeats.lsws > 0) {
          finalKeys.push(item);
        }
        return finalKeys;
      });

      if (finalKeys.length > 0) {
        this.setState({
          exitPollSource: finalKeys,
          selectedSource: finalKeys[0],
          finalSourceData,
        });
      }
    }
    this.allianceInfoWrapperRef = React.createRef();
    document.addEventListener('click', this.closeAllianceInfo);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeAllianceInfo);
  }

  getSortedViewData = () => {
    const { isExitPoll, data } = this.props;
    if (
      !isExitPoll &&
      data &&
      Array.isArray(data.al_rslt) &&
      data.al_rslt[0] &&
      Array.isArray(data.pg_rslt) &&
      data.pg_rslt[0]
    ) {
      const alResult = data.pg_rslt[0];
      const prResult = data.al_rslt[0];
      const sortedPartyViewData = this.getPartyListInSortedOrder(prResult);
      const sortedAllianceViewData = this.getPartyListInSortedOrder(alResult);
      const sortedData = { sortedPartyViewData, sortedAllianceViewData };
      return sortedData;
    }

    return { sortedPartyViewData: [], sortedAllianceViewData: [] };
  };

  getCountOfLeadPlusWins = data => {
    const { isExitPoll } = this.props;
    const seatCount = { winCount: 0, leadPlusWinCount: 0 };
    const party = Object.keys(data);
    for (let counter = 0; counter < party.length; counter += 1) {
      if (isExitPoll === true) {
        seatCount.leadPlusWinCount += data[party[counter]].lsws || 0;
      } else {
        seatCount.leadPlusWinCount +=
          data[party[counter]].ls + data[party[counter]].ws || 0;
        seatCount.winCount += data[party[counter]].ws || 0;
      }
    }
    return seatCount;
  };

  getSelectedSourceData = () => {
    const { selectedSource } = this.state;
    const { sourceData } = this.props;
    if (!selectedSource) {
      return {};
    }
    return sourceData[selectedSource];
  };

  compareSeats = (a, b) => b.ls + b.ws - (a.ls + a.ws);

  getPartyListInSortedOrder = data => {
    if (data && (Array.isArray(data) || data.length > 0)) {
      data.sort(this.compareSeats);
    }

    return data;
  };
  handleSourceOnChange = e => {
    this.setState({ selectedSource: e.target.value });
  };

  getSeries = (data, totalSeats) => {
    const series = [];
    let val = {};
    let totalwls = 0;
    if (Array.isArray(data) && data.length > 0) {
      const len = data.length;
      let firstNonZeroIndex = -1;
      // let bottomIndex = 0;
      // let nonZeroIndexFound = false;
      for (let counter = len - 1; counter >= 0; counter -= 1) {
        val = {
          name: data[counter].an.toUpperCase(),
          data: [data[counter].ls + data[counter].ws],
          color: data[counter].color || data[counter].cc,
        };
        totalwls = totalwls + data[counter].ls + data[counter].ws;

        if (
          data[counter].ls + data[counter].ws > 0 &&
          firstNonZeroIndex === -1
        ) {
          firstNonZeroIndex = len - counter - 1;
          // nonZeroIndexFound = true;
          // val.borderRadiusTopLeft = '20%';
          // val.borderRadiusTopRight = '20%';
        }
        // else if (counter === 0) {
        //   val.borderRadiusBottomLeft = '20%';
        //   val.borderRadiusBottomRight = '20%';
        //   // lastNonZeroIndex = len - counter - 1;
        // }
        series.push(val);
      }

      // if (totalwls === totalSeats) {
      //   bottomIndex = firstNonZeroIndex === -1 ? 0 : firstNonZeroIndex;

      //   // series[bottomIndex].borderRadiusTopLeft = '20%';
      //   // series[bottomIndex].borderRadiusTopRight = '20%';
      // }
    }

    const emptyData = {
      name: '',
      data: [totalSeats - totalwls],
      color: '#ececec',
      // borderRadiusTopLeft: '20%',
      // borderRadiusTopRight: '20%',
    };

    // if (totalwls === 0) {
    //   emptyData.borderRadiusBottomLeft = '20%';
    //   emptyData.borderRadiusBottomRight = '20%';
    // }
    series.unshift(emptyData);
    return series;
  };

  setActiveTab = event => {
    if (!event || !event.target) {
      return;
    }
    const tabNum = event.target.getAttribute('data-tab');
    this.setState({
      activeTab: tabNum ? Number(tabNum) : this.state.activeTab,
    });
  };

  closeAllianceInfo = e => {
    if (
      this.allianceInfoWrapperRef &&
      this.allianceInfoWrapperRef.current &&
      !this.allianceInfoWrapperRef.current.contains(e.target) &&
      this.state.showAllianceInfo
    ) {
      this.setState({ showAllianceInfo: false });
    }
  };

  toggleAllianceInfoPopup = allianceMap => {
    const { showAllianceInfo } = this.state;
    const { setAlliancePopUpData, isWapView } = this.props;
    if (isWapView) {
      setAlliancePopUpData(allianceMap);
    } else {
      this.setState({ showAllianceInfo: !showAllianceInfo });
    }
  };

  getLeadingParty = (sortedPartyData, ttl_seat, isExitPoll) => {
    let leadingPartyObj = {};
    if (
      !Array.isArray(sortedPartyData) ||
      (sortedPartyData && sortedPartyData.length === 0) ||
      isExitPoll
    ) {
      return leadingPartyObj;
    }
    const majority = Math.floor(ttl_seat / 2) + 1;
    const [
      firstPartyData = { ws: 0, ls: 0 },
      secondPartyData = { ws: 0, ls: 0 },
    ] = [...sortedPartyData];
    const totalWonSeats = sortedPartyData.reduce((total, partyData) => ({
      ws: total.ws + partyData.ws,
    }));

    if (firstPartyData.ws > majority) {
      //First party WON
      leadingPartyObj = {
        party: firstPartyData.an,
        text: 'WON',
        color: firstPartyData.cc,
      };
    } else if (totalWonSeats.ws === ttl_seat && firstPartyData.ws < majority) {
      //Election over but Hung assembly
      leadingPartyObj = {
        party: 'HUNG ASSEMBLY',
        text: 'NO MAJORITY',
        color: '#595959',
      };
    } else if (
      firstPartyData.ws + firstPartyData.ls > majority ||
      firstPartyData.ws + firstPartyData.ls >
        secondPartyData.ws + secondPartyData.ls
    ) {
      //First party LEADING
      leadingPartyObj = {
        party: firstPartyData.an,
        text: 'LEADING',
        color: firstPartyData.cc,
      };
    }
    if (leadingPartyObj.party === 'OTH') {
      leadingPartyObj = {};
    }
    return leadingPartyObj;
  };

  getAllianceMap = (data, allianceData) => {
    const partyData = this.getPartyListInSortedOrder(data.pr_rslt);
    const allianceMap = {};
    const finalAllianceMap = [];
    if (Array.isArray(partyData)) {
      partyData.map(item => {
        if (item.al_id && item.al_id !== 1) {
          allianceMap[item.al_id] = allianceMap[item.al_id] || [];
          allianceMap[item.al_id].push(item);
        }
        return allianceMap;
      });
    }
    if (Array.isArray(allianceData)) {
      allianceData.map(item => {
        if (allianceMap[item.a_id] && item.an) {
          finalAllianceMap.push({
            name: item.an,
            color: item.cc,
            data: allianceMap[item.a_id],
            totalSeats: item.ls + item.ws,
          });
        }
        return finalAllianceMap;
      });
    }
    return finalAllianceMap;
  };

  shiftOthToRight = sortedPartyData => {
    let index1;
    if (Array.isArray(sortedPartyData) && sortedPartyData.length > 1) {
      sortedPartyData.map((item, index) => {
        if (item.an === 'OTH') {
          index1 = index;
        }
        return index1;
      });
      if (index1 !== undefined) {
        const othData = sortedPartyData.splice(index1, 1);
        sortedPartyData.push(othData[0]);
      }
    }
    return sortedPartyData;
  };

  render() {
    // const cardno = cardcount;
    const {
      config,
      data,
      isExitPoll,
      starCandidateData,
      ExternalClass,
      cssObject: {
        statewrapper = '',
        sources = '',
        parties = '',
        count = '',
        majority = '',
        statenamehide = '',
        totalseatcount = '',
        stateBar = '',
      } = {},
      showLeadsLabel,
      showResultWdtBtn,
      hideBattle,
      hidePartyAllianceView,
      isStarcnd,
      showViewCompleteCvgLink,
      hideStarCandidate,
      hideLiveblog,
      isIframeCssRequired,
      hideETheading,
    } = this.props;

    const {
      exitPollSource,
      // sortedPartyViewData,
      // sortedAllianceViewData,
      activeTab,
      showAllianceInfo,
      selectedSource,
      finalSourceData,
    } = this.state;
    const wrapperClass = classNames({
      [s.state]: true,
      [ExternalClass]: ExternalClass,
    });

    const {
      sortedPartyViewData,
      sortedAllianceViewData,
    } = this.getSortedViewData();
    if (!data || !data.ttl_seat) {
      return null;
    }

    const partyData = this.getSelectedSourceData();
    if (isExitPoll && !partyData) {
      return null;
    }

    let sortedPartyData;
    let sortedAllianceData;

    if (isExitPoll) {
      sortedPartyData = this.getPartyListInSortedOrder(partyData);
    } else {
      sortedPartyData = sortedPartyViewData;
      sortedAllianceData = sortedAllianceViewData;
    }

    const leadingPartyObj = this.getLeadingParty(
      sortedAllianceData,
      data.ttl_seat,
      isExitPoll,
    );

    const allianceMap = isExitPoll
      ? {}
      : this.getAllianceMap(data, sortedAllianceData);

    sortedPartyData = this.shiftOthToRight(sortedPartyData);
    sortedAllianceData = this.shiftOthToRight(sortedAllianceData);
    const seatData = this.getCountOfLeadPlusWins(sortedPartyData);

    return (
      <div className={`${wrapperClass} ${statewrapper}`}>
        <div className={`${s.stateHeader} ${s.flexbox} ${statenamehide}`}>
          <h4 className={s.stateName}>
            <Link
              href={config.path}
              data-newga={`click#${config.path}#Election_Widget_Homepage`}
              target="_blank"
            >
              {config.name}
            </Link>
            {!isExitPoll && (
              <span className={s.leadWins}>
                {seatData.winCount === data.ttl_seat
                  ? 'Results'
                  : 'Leads + Wins'}
              </span>
            )}
          </h4>
          <div className={s.counts}>
            <strong>{seatData.leadPlusWinCount}</strong>/
            {data.ttl_seat}
          </div>
        </div>

        {!hidePartyAllianceView &&
          !isExitPoll && (
            <div className={s.partyInfo}>
              <ul onClick={this.setActiveTab}>
                <li className={activeTab === 2 ? s.active : ''} data-tab="2">
                  Alliance View
                </li>
                <li className={activeTab === 1 ? s.active : ''} data-tab="1">
                  Party View
                </li>
              </ul>
            </div>
          )}

        {isExitPoll && (
          <React.Fragment>
            <div
              className={`${s.sourceInfo} ${s.flexbox} ${sources} ${
                !isIframeCssRequired ? 'sourcesas' : ''
              } `}
            >
              <span className={s.sourceText}>Source</span>
              <div className={s.selectBox}>
                <select
                  onChange={e => this.handleSourceOnChange(e)}
                  disabled={!(exitPollSource && exitPollSource.length > 0)}
                >
                  {exitPollSource && exitPollSource.length > 0 ? (
                    exitPollSource.map(source => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))
                  ) : (
                    <option key="Select" value="Select" disabled selected>
                      Select
                    </option>
                  )}
                </select>
              </div>
            </div>
          </React.Fragment>
        )}
        {this.props.showbarchart &&
          !isStarcnd && (
            <div className={`${s.stateBar} ${stateBar}`}>
              {sortedPartyData &&
                sortedPartyData.length > 0 && (
                  <React.Fragment>
                    {isExitPoll ? (
                      <div className={s.stateBarInner}>
                        {exitPollSource &&
                          exitPollSource.length > 0 &&
                          exitPollSource.map(source => (
                            <div
                              style={{
                                display: `${
                                  selectedSource === source ? 'block' : 'none'
                                }`,
                              }}
                            >
                              <RenderChart
                                type="stackedbar"
                                series={this.getSeries(
                                  finalSourceData[source],
                                  data.ttl_seat,
                                )}
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <React.Fragment>
                        <div
                          className={`${s.stateBarInner} ${
                            activeTab === 1 ? s.show : s.hide
                          }`}
                        >
                          <RenderChart
                            type="stackedbar"
                            series={this.getSeries(
                              sortedPartyData,
                              data.ttl_seat,
                            )}
                          />
                        </div>
                        <div
                          className={`${s.stateBarInner} ${
                            activeTab === 2 ? s.show : s.hide
                          }`}
                        >
                          <RenderChart
                            type="stackedbar"
                            series={this.getSeries(
                              sortedAllianceData,
                              data.ttl_seat,
                            )}
                          />
                        </div>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              {isExitPoll &&
                exitPollSource &&
                exitPollSource.length === 0 && (
                  <div className={s.stateBarInner}>
                    <RenderChart
                      type="stackedbar"
                      series={this.getSeries([], data.ttl_seat)}
                    />
                  </div>
                )}
              <div
                className={`${
                  s.totalseatcount
                } ${totalseatcount} totalseatcount`}
              >
                <span>Seats:</span> <strong>{seatData.leadPlusWinCount}</strong>/{
                  data.ttl_seat
                }
              </div>
              <p className={`${s.majority} ${majority} majority`}>
                Majority <strong>{Math.floor(data.ttl_seat / 2) + 1}</strong>
              </p>
              {showLeadsLabel && (
                <span className={s.leadWins}>
                  {seatData.winCount === data.ttl_seat
                    ? 'Results'
                    : 'Leads + Wins'}
                </span>
              )}
            </div>
          )}
        {!isStarcnd && (
          <div className={`${s.parties} ${parties} parties`}>
            <ul>
              {(activeTab === 1 || isExitPoll) &&
                sortedPartyData &&
                sortedPartyData.length > 0 &&
                sortedPartyData.map(party => (
                  <li className={s.partyListItem}>
                    <p
                      className={s.name}
                      style={{ color: party.cc || party.color }}
                    >
                      {party.an}
                    </p>
                    <p className={s.count}>{party.ls + party.ws}</p>
                  </li>
                ))}
              {activeTab === 2 &&
                sortedAllianceData &&
                sortedAllianceData.length > 0 &&
                sortedAllianceData.map(party => (
                  <li className={s.partyListItem}>
                    <p className={s.name} style={{ color: party.cc }}>
                      {party.an}
                    </p>
                    <p className={`${s.count} ${count}`}>
                      {party.ls + party.ws}
                    </p>
                  </li>
                ))}
            </ul>
            {!isExitPoll && (
              <>
                <div className={s.partyFooter}>
                  {!showViewCompleteCvgLink && (
                    <>
                      <div className={s.partyResult}>
                        <strong
                          className={`${s.party} ${s.bjp}`}
                          style={{ color: leadingPartyObj.color }}
                        >
                          {leadingPartyObj.party}
                        </strong>{' '}
                        {leadingPartyObj.text}
                      </div>
                      {(!isIframeCssRequired || hideETheading) && (
                        <div
                          className={s.allianceInfo}
                          ref={this.allianceInfoWrapperRef}
                          style={{
                            display: activeTab === 2 ? 'block' : 'none',
                          }}
                        >
                          <span
                            onClick={() =>
                              this.toggleAllianceInfoPopup(allianceMap)
                            }
                          >
                            Alliance Info
                            <i className={s.icon}>i</i>
                          </span>

                          {showAllianceInfo && (
                            <AlliancePopup
                              allianceMap={allianceMap}
                              toggleAllianceInfoPopup={() =>
                                this.toggleAllianceInfoPopup(allianceMap)
                              }
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {showViewCompleteCvgLink && (
                    <div className={s.electionFooter}>
                      <Link
                        to={`https://${window.location.host}`}
                        className={s.button}
                        data-ga={`${
                          typeof window === 'object' &&
                          window.location.pathname
                            .toLowerCase()
                            .match('/articleshow/')
                            ? 'Election_Result_AS_Widget|Click'
                            : 'Election_Result_Live_Blog_Widget|Click'
                        }`}
                        data-setgacategory
                      >
                        View Complete coverage
                      </Link>
                      {/* Commented to make consistent design
                      {this.props.isWapView && (
                        <span className={s.sourceText}>Source: C-Voter</span>
                      )} */}
                    </div>
                  )}
                </div>
                {!this.props.showbarchart &&
                  showLeadsLabel && (
                    <span className={s.leadWins}>
                      {seatData.winCount === data.ttl_seat
                        ? 'Results'
                        : 'Leads + Wins'}
                    </span>
                  )}
              </>
            )}
          </div>
        )}
        {!isExitPoll &&
          !hideLiveblog &&
          config.liveblog && (
            <div className={s.liveblog}>
              <LiveblogUpdates
                isWapView={this.props.isWapView}
                liveblogData={config.liveblog}
                storiesCount={0}
                // hideHeader
                hideContent
                themeClass
              />
            </div>
          )}
        {(isStarcnd || (!hideBattle && !isExitPoll && !this.props.isWapView)) &&
          !hideStarCandidate &&
          starCandidateData && (
            <ElectionBattle
              isWapView={this.props.isWapView}
              starCandidateData={starCandidateData}
              showResultWdtBtn={showResultWdtBtn}
              state={config.key}
              isStarcnd={isStarcnd}
            />
          )}
      </div>
    );
  }
}

ElectionState.propTypes = {
  data: PropTypes.shape({}),
  config: PropTypes.shape({}).isRequired,
  sourceData: PropTypes.shape({}),
  isExitPoll: PropTypes.bool,
  isWapView: PropTypes.bool,
  ExternalClass: PropTypes.string,
  cssObject: PropTypes.shape({}),
  showbarchart: PropTypes.bool,
};
ElectionState.defaultProps = {
  data: {},
  sourceData: {},
  isExitPoll: false,
  isWapView: false,
  ExternalClass: '',
  cssObject: {},
  showbarchart: true,
};

export default ElectionState;
