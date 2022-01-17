import React from 'react';
import PropTypes from 'prop-types';

class NavigationSchema extends React.Component {
  static propTypes = {
    navObject: PropTypes.shape({}).isRequired,
  };
  render() {
    const { navObject } = this.props;
    return (
      <>
        {Object.keys(navObject).map((navKey, index) => {
          const sectionObject = navObject[navKey];
          if (sectionObject && typeof sectionObject.link === 'string') {
            return (
              <React.Fragment key={index}>
                <meta itemProp="name" content={sectionObject.label} />
                <meta itemProp="url" content={sectionObject.link} />
              </React.Fragment>
            );
          }
          return null;
        })}
      </>
    );
  }
}
export default NavigationSchema;
