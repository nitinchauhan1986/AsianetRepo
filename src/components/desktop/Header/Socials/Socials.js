import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import { TOI_LIVE_DOMAIN } from '../../../../constants';
import s from './Socials.scss';

class Socials extends React.Component {
  render() {
    const { colorTheme } = this.props;
    const theme = colorTheme ? s[colorTheme] : '';
    return (
      <ul className={`${s.sociable} ${theme}`}>
        <li className={s.twitter}>
          <Link
            target="_blank"
            rel="nofollow noreferrer"
            className={s['sports-sprite']}
            data-ga="top_header|social_profile_icons|social_twitter"
            to="https://twitter.com/timesofindia"
            title="Twitter"
          />
        </li>
        <li className={s.fb}>
          <Link
            target="_blank"
            rel="nofollow noreferrer"
            className={s['sports-sprite']}
            data-ga="top_header|social_profile_icons|social_fb"
            to="https://www.facebook.com/TimesofIndia"
            title="Facebook"
          />
        </li>
        <li className={s.rss}>
          <Link
            className={s['sports-sprite']}
            data-ga="top_header|social_profile_icons|social_rss"
            to={`${TOI_LIVE_DOMAIN}/rss.cms`}
            title="RSS"
          />
        </li>
        <li className={s.youtube}>
          <Link
            target="_blank"
            rel="nofollow noreferrer"
            className={s['sports-sprite']}
            data-ga="top_header|social_profile_icons|social_youtube"
            to="https://www.youtube.com/user/TimesOfIndiaChannel"
            title="YouTube"
          />
        </li>
      </ul>
    );
  }
}

Socials.propTypes = {
  colorTheme: PropTypes.string,
};
Socials.defaultProps = {
  colorTheme: '',
};
export default Socials;
