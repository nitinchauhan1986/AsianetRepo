import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from 'components/Link';
import { bindGa } from 'helpers/analytics';
import jsonp from 'jsonp';
import { getSiteDomain } from 'utils/common';
import makeRequest from 'utils/makeRequest';
import s from './Search.scss';
import { getSearchApi } from './config';
import { loadVideosearchDataCount } from '../../../../reduxUtils/modules/videosearch';
import { loadtopvideos } from '../../../../reduxUtils/modules/topvideos';

class Search extends React.Component {
  static renderVideoResultItem(resultItem) {
    // const resultLink = Search.getItemLink(resultItem);
    const selectedCss = resultItem.isSelected ? 'selected' : '';
    return (
      <li key={resultItem.url} className={s[selectedCss]}>
        <Link
          data-newga={`NavBar-Search#Search_Initiate | ${resultItem.title ||
            ''}`}
          to={resultItem.url}
        >
          {resultItem.title || ''}
        </Link>
      </li>
    );
  }

  getHighlightedResults(resultText) {
    const { searchedValue } = this.state;
    const searchedValueFirstIndex = resultText
      .toLowerCase()
      .indexOf(searchedValue.toLowerCase());
    return (
      <React.Fragment>
        {resultText.substring(0, searchedValueFirstIndex)}
        {
          <span className={s.resultSearchString}>
            {resultText.substring(
              searchedValueFirstIndex,
              searchedValueFirstIndex + searchedValue.length,
            )}
          </span>
        }
        {resultText.substring(
          searchedValueFirstIndex + searchedValue.length,
          resultText.length,
        )}
      </React.Fragment>
    );
  }

  renderResultItem(resultItem) {
    const { highlightSearchedWordInResult } = this.props;
    const resultLink = Search.getItemLink(resultItem);
    const resultText = resultItem[0] || '';
    const selectedCss = resultItem.isSelected ? 'selected' : '';
    return (
      <li key={resultItem[0]} className={s[selectedCss]}>
        <Link
          data-newga={`NavBar-Search#Search_Initiate | ${resultItem[0] || ''}`}
          to={resultLink}
        >
          {highlightSearchedWordInResult
            ? this.getHighlightedResults(resultText)
            : resultText}
        </Link>
      </li>
    );
  }

  static getItemLink(resultItem) {
    if (!(resultItem && resultItem instanceof Array && resultItem[0])) {
      return '';
    }
    const domain = getSiteDomain();
    const resultLink = `${domain}/topic/${resultItem[0]}`;
    return resultLink;
  }
  constructor(props) {
    super(props);
    this.state = {
      shouldShowSearchBox: false,
      lastSearchKeyword: '',
      searchResults: [],
    };
  }

  onKeyDown(event) {
    /*
			up = 38
			down = 40
			27 = escape
		*/
    /*
			ToDo - Add Debounce
		*/
    const keyCode = event.keyCode || event.which;
    if (keyCode === 40 || keyCode === 38) {
      this.markSelectedItem(keyCode);
    } else if (keyCode === 27) {
      this.setState({
        shouldShowSearchBox: false,
      });
    }
  }

  @bindGa({})
  onClick() {
    /*
    if (window.ga) {
      window.ga(
        'send',
        'event',
        `WEB-${window.location.href}`,
        'NavBar-Search',
        this.state.shouldShowSearchBox ? 'Close' : 'Click',
      );
    }
    */
    if (this.state.shouldShowSearchBox && this.searchField) {
      this.searchField.blur();
    }
    this.setState(
      {
        shouldShowSearchBox: !this.state.shouldShowSearchBox,
        searchedValue: '',
      },
      () => {
        if (this.searchField && this.state.shouldShowSearchBox) {
          this.searchField.focus();
        } else {
          this.searchField.blur();
          this.setState({
            searchResults: [],
            videoSearchResultData: [],
          });
        }
      },
    );

    this.searchField.value = '';
  }

  markSelectedItem() {
    const results = Object.assign([], this.state.searchResults);
    const selected = results.filter(item => item.isSelected);
    let indexToHighlight;
    if (!selected.length) {
      indexToHighlight = 0;
    } else {
      const currentHighlightedIndex = results.indexOf(selected[0]);
      if (currentHighlightedIndex === results.length - 1) {
        indexToHighlight = 0;
      } else {
        results[currentHighlightedIndex + 1].isSelected = true;
      }

      results[indexToHighlight].isSelected = true;
      results[currentHighlightedIndex].isSelected = false;
    }

    this.setState({
      searchResults: results,
    });
  }
  static formatVideoSearchData(data = {}) {
    if (data.Documents instanceof Array) {
      return data.Documents.map(item => ({
        title: item.title.value,
        url: `https://timesofindia.indiatimes.com/${item.seopath}/videoshow/${
          item.msid
        }.cms`,
      })).filter((item, index) => index < 7);
    }
    return [];
  }

  fetchSearchResults = event => {
    const apiDetails = getSearchApi();
    let searchKeyword = event.target.value || '';
    this.setState({
      searchedValue: searchKeyword,
    });
    searchKeyword = searchKeyword.trim();

    let url = `${apiDetails.endpoint}?q=${searchKeyword}`;
    apiDetails.params.forEach(item => {
      url += `&${item.key}=${item.value}`;
    });
    if (window.location.href.indexOf('/videos') > 0 && !this.props.isWapView) {
      makeRequest
        .get(
          `/video_search_api/feedtype-sjson,sortOrder-score+desc,query-${searchKeyword},page-1.cms`,
        )
        .then(response => response.data)
        .then(data => {
          this.state.videoSearchResultData = [];
          this.setState({
            videoSearchResultData: Search.formatVideoSearchData(data),
          });
        })
        .catch(() => {
          //console.log(err)
        });
      return;
    }
    if (!searchKeyword) {
      this.setState({
        searchResults: [],
      });
    }
    if (!searchKeyword || searchKeyword === this.state.lastSearchKeyword) {
      return;
    }

    this.setState({
      lastSearchKeyword: searchKeyword,
    });
    jsonp(url, null, (err, data) => {
      if (
        data &&
        data instanceof Array &&
        data.length &&
        data[1] &&
        data[1] instanceof Array
      ) {
        this.setState({
          searchResults: data[1],
        });
      }
    });
  };
  renderSearchResults(data) {
    if (!(data && data instanceof Array)) {
      return null;
    }

    return (
      <ul className={s.nav_autosuggest_result}>
        {data.map(item => this.renderResultItem(item))}
      </ul>
    );
  }
  static renderVideoSearchResults(data = []) {
    return (
      <ul className={s.nav_autosuggest_result}>
        {data.map(item => Search.renderVideoResultItem(item))}
      </ul>
    );
  }

  onFormSubmitVideos(event) {
    event.preventDefault();
    this.setState({
      shouldShowSearchBox: false,
    });
    const obj = { searchitem: this.searchField.value };
    this.props.loadVideosearchDataCount(obj);
    this.props.loadtopvideos();
    return false;
  }

  @bindGa({})
  onFormSubmit(event) {
    event.preventDefault();
    const resultLink = Search.getItemLink(this.state.searchResults[0]);
    if (resultLink) {
      window.location.href = resultLink;
    }
    return false;
  }

  render() {
    const { sticky } = this.props;
    const searchWrapperActiveClasses = this.state.shouldShowSearchBox
      ? 'active'
      : '';
    const gaLabelForSearchIcon = this.state.shouldShowSearchBox
      ? 'Search-Close'
      : 'Search-Click';
    const gaLabelForSearchKeyword =
      this.state.searchResults && this.state.searchResults.length > 0
        ? this.state.searchResults[0][0]
        : '';
    return (
      <div
        className={classNames({
          [`${s['search-form']}`]: true,
          [`${s[this.props.theme]}`]: this.props.theme,
          [`${s[searchWrapperActiveClasses]}`]: true,
          [`${s.sticky}`]: sticky,
          // [`${s[this.props.colorTheme]}`]: this.props.colorTheme,
        })}
      >
        <div className="contentwrapper small rel">
          <span
            onClick={event => this.onClick(event)}
            className={`${s['search-btn']}`}
            data-newga={`NavBar-Search#${gaLabelForSearchIcon}`}
          />
          <div
            className={`${s.inner} ${
              !this.state.shouldShowSearchBox ? s.hideSearchBox : ''
            }`}
          >
            <form
              data-plugin="navsearchboxvalidate"
              name="frmsearch1"
              onSubmit={event => {
                if (
                  window.location.href.indexOf('/videos') > 0 &&
                  !this.props.isWapView
                ) {
                  this.onFormSubmitVideos(event);
                } else {
                  this.onFormSubmit(event);
                }
              }}
              data-newga={`NavBar-Search#Search-Initiate-${gaLabelForSearchKeyword}`}
            >
              <input
                ref={el => {
                  if (el) {
                    this.searchField = el;
                  }
                }}
                onKeyDown={event => this.onKeyDown(event)}
                onChange={event => this.fetchSearchResults(event)}
                tabIndex="1"
                autoFocus="autoFocus"
                id="searchField"
                autoComplete="off"
                name="query"
                className="textbox"
                type="text"
              />
              <input value="search" className="submit" type="submit" />
              <input type="hidden" value="" name="type" />
              <input type="hidden" value="233446897" name="catkey" />
              <input type="hidden" value="3" name="search" />
              <input type="hidden" value="" name="sitesearch" />
              <input type="hidden" value="1" name="fields" />
              <input type="hidden" value="2" name="searchtype" />
              <input type="hidden" value="2" name="article" />
              <input value="0" type="hidden" name="search1" />
              {/* <br className="clearfix"/> */}
            </form>
            {this.state.searchResults &&
              this.renderSearchResults(this.state.searchResults)}
            {this.state.videoSearchResultData &&
              Search.renderVideoSearchResults(this.state.videoSearchResultData)}
          </div>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  theme: PropTypes.string,
  loadVideosearchDataCount: PropTypes.func.isRequired,
  // colorTheme: PropTypes.string,
  isWapView: PropTypes.bool.isRequired,
  loadtopvideos: PropTypes.func.isRequired,
  highlightSearchedWordInResult: PropTypes.bool,
  sticky: PropTypes.bool,
};

Search.defaultProps = {
  theme: undefined,
  sticky: false,
  highlightSearchedWordInResult: false,
};
const mapDispatchtoProps = dispatch => ({
  loadVideosearchDataCount: params => {
    dispatch(loadVideosearchDataCount(params));
  },
  loadtopvideos: () => {
    dispatch(loadtopvideos());
  },
});
export default connect(undefined, mapDispatchtoProps)(Search);
