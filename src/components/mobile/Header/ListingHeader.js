import React from 'react';
import Link from 'components/Link';
import BottomSearch from 'components_v2/mobile/BottomSearch';
import AddOrgSchema from 'components_v2/common/AddOrgSchema';
import s from './ListingHeader.scss';

const ListingHeader = data => {
  const getSubSection =
    data.headerLabel || (data.data && data.data.split('-')[1]);
  const APIUrl =
    'https://timesofindia.indiatimes.com/feeds/web_navigation_feed_spadata.cms?category=changecity&feedtype=sjson';
  const listAPIUrl = __PROD__
    ? APIUrl
    : APIUrl.replace('timesofindia.indiatimes', 'toidev.indiatimes');
  const insertJsx = (
    <div className={s.logo}>
      <Link to="https://m.timesofindia.com" className={s.logoImg} />
      {data.h1Required ? (
        <h1>{getSubSection}</h1>
      ) : (
        <span>{getSubSection}</span>
      )}
    </div>
  );
  const ModifiedJsx = AddOrgSchema(insertJsx);
  return (
    <div className={s.listingHeader}>
      <ModifiedJsx />
      {data.data &&
        data.data.split('-')[1] === 'city' && (
          <div className={s.changeCity}>
            <BottomSearch
              data={listAPIUrl}
              showSearchBox
              iconClass={s.cityIcon}
              sectionName={
                data.headerLabel || (data.data && data.data.split('-')[2])
              }
              // gaData={{
              //   gaAction: `${sectionData.name}-TabChange`,
              //   partialGaLabel: 'Click',
              // }}
              // toggleLoader={this.toggleLoader}
              // headingname={sectionData.name}
              // headingLink={sectionData.link || sectionData.path}
              // linkData={{
              //   gaAction,
              //   gaLabel: 'Click-Header',
              // }}
            />
          </div>
        )}
    </div>
  );
};

// ListingHeader.propTypes = {
//   data: PropTypes.objectOf({}),
// };
// ListingHeader.defaultProps = {
//   data: {},
// };

export default React.memo(ListingHeader);
