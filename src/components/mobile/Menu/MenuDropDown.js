import React from 'react';
// import classNames from 'classnames';
import { wait } from 'utils/common';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from 'components/Link';
import { sendGaThroughProps } from 'helpers/analytics/sendGaThroughProps';
import ScrollBar from '../../common/ScrollBar/ScrollBar';
import s from './MenuDropDown.scss';

class MenuDropDown extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  static getAlphabetSplitArray(dataObj) {
    const newArrayMapping = {};
    if (dataObj.data.filter(item => item.label === 'Other Cities')[0]) {
      dataObj.data
        .filter(item => item.label === 'Other Cities')[0]
        .data.forEach(item => {
          if (item && item.label) {
            const firstCharacter = item.label[0];
            if (newArrayMapping[firstCharacter]) {
              newArrayMapping[firstCharacter].push(item);
            } else {
              newArrayMapping[firstCharacter] = [item];
            }
          }
        });
    }

    return Object.entries(newArrayMapping).sort(
      (item1, item2) => (item1[0] > item2[0] ? 1 : -1),
    );
  }

  async handleDropDownClick(event) {
    event.preventDefault();

    if (!this.state.isDropdownOpen) {
      this.setState({
        isDropdownOpen: !this.state.isDropdownOpen,
      });
      await wait(0);
      this.setState({
        mounted: !this.state.mounted,
      });
      sendGaThroughProps({ data: this.props.data });
    } else {
      this.setState({
        mounted: !this.state.mounted,
      });
      await wait(300);
      this.setState({
        isDropdownOpen: !this.state.isDropdownOpen,
      });
    }
  }
  render() {
    const { linkItem, linkClassName, activeLinkClassName } = this.props;
    const { subMenuList = {} } = linkItem;
    const { isDropdownOpen } = this.state;
    const containerClassName = classNames({
      [s.l2dropmenu]: true,
      [s.open]: this.state.mounted,
    });
    if (!(subMenuList.data instanceof Array)) {
      return null;
    }
    const subMenuLinkClassname = classNames({
      [linkClassName]: true,
      [activeLinkClassName]: isDropdownOpen,
    });
    const alphabetSortedArray = MenuDropDown.getAlphabetSplitArray(subMenuList);
    return (
      <React.Fragment key={linkItem.link}>
        <Link
          to={linkItem.link}
          className={subMenuLinkClassname}
          onClick={
            linkItem
              ? event => this.handleDropDownClick(event, linkItem)
              : undefined
          }
        >
          {linkItem.label}
          <meta itemProp="name" content={linkItem.label} />
          <meta itemProp="url" content={linkItem.link} />
        </Link>

        {isDropdownOpen && (
          <ScrollBar className={containerClassName} delay={500}>
            <React.Fragment>
              {subMenuList.data
                .filter(
                  item =>
                    item.label === 'Metro Cities' || item.label === 'Dropdown',
                )
                .map(item => (
                  <div
                    className={`${s.submenu_wrapper} ${s.topcity}`}
                    key={item.label}
                  >
                    {item.data.map(linkItemSubmneu => (
                      <Link
                        to={linkItemSubmneu.link}
                        key={linkItemSubmneu.label}
                        data={{
                          gaCategory: 'hamburger_menu',
                          gaAction: linkItemSubmneu.label,
                          gaLabel: '',
                        }}
                      >
                        {linkItemSubmneu.label}
                      </Link>
                    ))}
                  </div>
                ))}
              <div className={s.citymenu}>
                {alphabetSortedArray.map(item => (
                  <div
                    className={s.submenu_wrapper}
                    key={item[0]}
                    data-letter={item[0]}
                  >
                    {item[1].map(linkItemSubmneu => (
                      <Link
                        to={linkItemSubmneu.link}
                        key={linkItemSubmneu.label}
                        data={{
                          gaCategory: 'hamburger_menu',
                          gaAction: linkItemSubmneu.label,
                          gaLabel: '',
                        }}
                      >
                        {linkItemSubmneu.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </React.Fragment>
          </ScrollBar>
        )}
      </React.Fragment>
    );
  }
}
MenuDropDown.propTypes = {
  data: PropTypes.shape({}).isRequired,
  linkItem: PropTypes.shape({}).isRequired,
  linkClassName: PropTypes.string.isRequired,
  activeLinkClassName: PropTypes.string.isRequired,
};

export default MenuDropDown;
