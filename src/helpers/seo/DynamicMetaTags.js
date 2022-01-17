import React from 'react';
import PropTypes from 'prop-types';

/*
    sample metaTags object 

    "metaTags":[
        {
            "tagName":"meta",
            "attributes":[
                {
                    "attributeName":"name",
                    "attributeValue":"ROBOTS"
                },
                {
                    "attributeName":"content",
                    "attributeValue":"NOINDEX, NOFOLLOW"
                }
            ]
        }
    ]
 */
export default class DynamicMetaTags extends React.Component {
  render() {
    const { seoObject } = this.props;
    if (seoObject.metaTags instanceof Array) {
      return seoObject.metaTags.map(tagItem => {
        const { tagName } = tagItem;
        const attributeMapping = {};
        if (tagItem.attributes instanceof Array) {
          tagItem.attributes.forEach(item => {
            attributeMapping[item.attributeName] = item.attributeValue;
          });
        }
        return React.createElement(tagName, attributeMapping, null);
      });
    }
    return null;
  }
}
DynamicMetaTags.propTypes = {
  seoObject: PropTypes.shape({
    metaTags: PropTypes.arrayOf(
      PropTypes.shape({
        tagName: PropTypes.string,
        attributes: PropTypes.arrayOf(
          PropTypes.shape({
            attributeName: PropTypes.string.isRequired,
            attributeValue: PropTypes.string.isRequired,
          }),
        ),
      }),
    ),
  }),
};
DynamicMetaTags.defaultProps = {
  seoObject: PropTypes.shape({}),
};
