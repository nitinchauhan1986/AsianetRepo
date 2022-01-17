import React from 'react';
import PropTypes from 'prop-types';

class CtnAdDiv extends React.Component {
  constructor() {
    super();
    this.state = {
      isClientSide: false,
    };
    const position = Math.floor(10000000 + Math.random() * 90000000);
    this.pos = position;
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.setState({ isClientSide: true });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isClientSide !== nextState.isClientSide) {
      return true;
    }
    return false;
  }
  render() {
    const { adsCounter = 1 } = this.props;

    if (this.state.isClientSide && this.props.data && this.props.data.adCode) {
      const newAdObject = {
        id: `div-clmb-ctn-${this.props.data.adCode}-${adsCounter}${this.props
          .data.divId ||
          this.props.data.msid ||
          this.pos}`,
        slot: this.props.data.adCode,
        pos: `${adsCounter}${this.props.data.msid || this.pos}`,
        section: this.props.data.breadCrumb,
        dfpslot: this.props.data.dfpslot,
      };
      const { id, slot, pos, section, dfpslot } = newAdObject;
      return (
        <div className="ctn-workaround-div clearfix">
          {dfpslot && dfpslot.adCode ? (
            <div
              id={id}
              data-slot={slot}
              data-position={pos}
              data-section={section}
              className={`colombia ${this.props.className}`}
              data-dfpslot={dfpslot.adCode}
              data-type="dfp"
            />
          ) : (
            <div
              id={id}
              data-slot={slot}
              data-position={pos}
              data-section={section}
              className={`colombia ${this.props.className}`}
            />
          )}
        </div>
      );
    }
    return '';
  }
}

CtnAdDiv.propTypes = {
  data: PropTypes.shape({
    adCode: PropTypes.number.isRequired,
    msid: PropTypes.string.isRequired,
    divId: PropTypes.string,
    breadCrumb: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  adsCounter: PropTypes.number.isRequired,
};
CtnAdDiv.defaultProps = {
  className: 'colombia_spacing',
};

export default CtnAdDiv;
