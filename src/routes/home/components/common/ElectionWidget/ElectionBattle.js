import React from 'react';
import PropTypes from 'prop-types';
import { sendGaThroughProps } from 'helpers/analytics/sendGaThroughProps';
import s from './ElectionBattle.scss';
import { sortByKey } from '../../../../../utils/common';

const csValueMapping = {
  3: 'won',
  1: 'leading',
  2: 'trailing',
  4: 'lost',
};

class ElectionBattle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cnsMappingData: null,
      selectedCnsId: null,
    };
    this.sortedStarCandidates = [];
  }

  componentDidMount() {
    this.createElectionData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.starCandidateData !== prevProps.starCandidateData) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.createElectionData();
    }
  }

  createElectionData = () => {
    const { starCandidateData } = this.props;
    if (
      !starCandidateData ||
      typeof starCandidateData !== 'object' ||
      Object.keys(starCandidateData).length === 0
    ) {
      return;
    }
    const { cnt_rslt } = starCandidateData;
    const cnsMappingData = {};

    if (Array.isArray(cnt_rslt)) {
      cnt_rslt.forEach(cnt => {
        if (!cnsMappingData[cnt.cns_id]) {
          cnsMappingData[cnt.cns_id] = [];
        }
        cnsMappingData[cnt.cns_id].push(cnt);
      });
    }
    this.setState({ cnsMappingData }, () => this.setSortedStarCandidates());
  };

  setSortedStarCandidates = () => {
    const { cnsMappingData, selectedCnsId } = this.state;
    let starCandidatesList = [];
    Object.keys(cnsMappingData).forEach(i => {
      if (Array.isArray(cnsMappingData[i])) {
        cnsMappingData[i].forEach(cns => {
          if (cns.star === true) {
            starCandidatesList.push(cns);
          }
        });
      }
    });
    starCandidatesList = sortByKey(starCandidatesList, 'cn');
    this.sortedStarCandidates = [...starCandidatesList];
    if (starCandidatesList[0]) {
      this.setState({
        selectedCnsId: selectedCnsId || starCandidatesList[0].cns_id,
      });
    }
  };

  onSelectStarCandidate = event => {
    if (!event || !event.target) {
      return;
    }
    const { options, selectedIndex } = event.target;
    const selectedStarCandidate = options[selectedIndex];
    const selectedCnsId = selectedStarCandidate.getAttribute('cnsid');
    if (selectedCnsId) {
      this.setState({ selectedCnsId });
    }
  };

  getConstituencyDataBykey = key => {
    if (!this.state.selectedCnsId) {
      return null;
    }
    const { cnsMappingData, selectedCnsId } = this.state;
    const candidateListByCns = cnsMappingData[selectedCnsId];
    if (key === 'cns_name') {
      return candidateListByCns[0].cns_name;
    } else if (key === 'cnt_list') {
      return candidateListByCns;
    }
    return null;
  };

  getFallbackStarCandidate = () => {
    if (!this.state.selectedCnsId) {
      return null;
    }
    const { cnsMappingData, selectedCnsId } = this.state;
    const candidateListByCns = cnsMappingData[selectedCnsId];

    if (Array.isArray(candidateListByCns)) {
      let losingStarCandidateCount = 0;
      const nonStarCandidate = [];
      for (let i = 0; i < candidateListByCns.length; i += 1) {
        if (candidateListByCns[i].cs === 4 || candidateListByCns[i].cs === 2) {
          losingStarCandidateCount += 1;
        }
        if (
          candidateListByCns[i].star === false &&
          (candidateListByCns[i].cs === 3 || candidateListByCns[i].cs === 1)
        ) {
          nonStarCandidate.push(candidateListByCns[i]);
        }
      }
      if (losingStarCandidateCount >= 2) {
        let _selectedData = null;
        if (Array.isArray(nonStarCandidate)) {
          _selectedData = nonStarCandidate.filter(
            candidate => candidate.cs === 1 || candidate.cs === 3,
          );
        }
        _selectedData = _selectedData[0];
        return _selectedData;
      }
    }
    return null;
  };
  electionBtnRedirection = e => {
    const { id } = e.target;
    const { state } = this.props;
    const category =
      typeof window === 'object' &&
      window.location.pathname.toLowerCase().match('/articleshow/')
        ? 'Election_Result_AS_Widget'
        : 'Election_Result_Live_Blog_Widget';
    sendGaThroughProps({
      data: {
        gaCategory: category,
        gaAction: 'click',
        gaLabel: window.location.href,
      },
    });
    // eslint-disable-next-line default-case
    switch (id) {
      case 'chech_cnst': {
        window.location.href = `https://timesofindia.indiatimes.com/elections/assembly-elections/${state &&
          state.replace('_', '-')}/constituencies`;
        break;
      }
      case 'view_cvg': {
        window.location.href = `https://${window.location.host}`;
        break;
      }
    }
  };

  render() {
    const { isWapView, showResultWdtBtn, isStarcnd } = this.props;
    const displayStarCandidatesList = this.getConstituencyDataBykey('cnt_list');
    const constituencyName = this.getConstituencyDataBykey('cns_name');
    const fallbackStarCandidate = this.getFallbackStarCandidate();

    return (
      <div className={`${s.electionBattle}`}>
        <div className={s.battleHeader}>
          {!isStarcnd && <h4>Key Contests</h4>}
          <div className={s.selectBox}>
            <select onChange={this.onSelectStarCandidate}>
              {this.sortedStarCandidates.map(
                item =>
                  item.star ? (
                    <option key={item.c_id} cid={item.c_id} cnsid={item.cns_id}>
                      {item.cn}
                    </option>
                  ) : (
                    ''
                  ),
              )}
            </select>
          </div>
        </div>
        <div className={`${s.box}`}>
          <div className={s.constituencyName}>
            Constituency <strong>{constituencyName}</strong>
          </div>
          <div className={s.candidateList}>
            {Array.isArray(displayStarCandidatesList) &&
              displayStarCandidatesList
                .filter(candidate => candidate.star === true)
                .map((candidate, idx) => (
                  <div
                    className={`${s.candidate} ${idx === 0 ? s.first : ''}`}
                    key={idx}
                  >
                    <div className={s.image}>
                      <img
                        src={`https://static.toiimg.com/photo/${
                          candidate.img
                        }.cms`}
                        alt="imag"
                      />
                    </div>
                    <div className={s.details}>
                      <p className={s.candidateName}>{candidate.cn}</p>
                      <strong
                        className={`${s.battleInfo} ${
                          s[csValueMapping[candidate.cs]]
                        }`}
                      >
                        <span>{candidate.an}</span>
                        {!isWapView && (
                          <span>{csValueMapping[candidate.cs]}</span>
                        )}
                      </strong>
                    </div>
                  </div>
                ))}
          </div>
          {!isWapView &&
            fallbackStarCandidate && (
              <div className={`${s.battleResult} ${s.won}`}>
                {fallbackStarCandidate.cn}{' '}
                <span className={`${s.battleInfo} ${s.bjp}`}>
                  <span>{fallbackStarCandidate.an}</span>
                  <span>{csValueMapping[fallbackStarCandidate.cs]}</span>
                </span>
              </div>
            )}
        </div>
        {!isStarcnd &&
          showResultWdtBtn && (
            <div className={s.buttonGrp}>
              <button
                id="chech_cnst"
                onClick={this.electionBtnRedirection}
                className={s.button}
              >
                Check your constituency
              </button>
              <button
                id="view_cvg"
                onClick={this.electionBtnRedirection}
                className={s.button}
              >
                View Complete coverage
              </button>
            </div>
          )}
      </div>
    );
  }
}

ElectionBattle.propTypes = {
  // isWapView: PropTypes.bool,
  data: PropTypes.shape({
    items: PropTypes.shape({}),
  }),
  starCandidateData: PropTypes.arrayOf(PropTypes.shape({})),
  state: PropTypes.string,
};
ElectionBattle.defaultProps = {
  // isWapView: false,
  data: {},
  starCandidateData: [],
  state: '',
};

export default ElectionBattle;
