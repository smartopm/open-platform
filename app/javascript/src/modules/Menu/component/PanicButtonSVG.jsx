
import React from 'react';
import PropTypes from 'prop-types'

const PanicButtonSVG = ({bind, t}) => (
  <svg width="217px" height="217px" {...bind} data-testid="sos-modal-panic-button">
    <g id="Panic-Button" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Emergency" transform="translate(-97.000000, -156.000000)">
        <g id="Group" transform="translate(109.000000, 168.000000)">
          <circle id="Oval-Copy" fillOpacity="0.22227382" fill="#FFFFFF" filter="url(#filter-1)" cx="96.5" cy="96.5" r="96.5" />
          <circle id="Oval" fill="#FFFFFF" cx="96.7055556" cy="96.7055556" r="84.7055556" />
          <text id="SOS" fontFamily="HelveticaNeue-Bold, Helvetica Neue" fontSize="44" fontWeight="bold" fill="#232323">
            <tspan x="51.328" y="98">{t('panic_alerts.sos')}</tspan>
          </text>
          <text id="Press-for-3-seconds" fontFamily="HelveticaNeue, Helvetica Neue" fontSize="13" fontWeight="normal" line-spacing="15" fill="#575757">
            <tspan x="38.598" y="121">{t('panic_alerts.press_for_3_seconds')}</tspan>
          </text>
        </g>
      </g>
    </g>
  </svg>
  );
  PanicButtonSVG.propTypes = {
    bind: PropTypes.instanceOf(Object).isRequired,
    t: PropTypes.func.isRequired
  }

export default PanicButtonSVG