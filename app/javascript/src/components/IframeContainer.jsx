import React from 'react';
import PropTypes from 'prop-types';

export default function IframeContainer({ link, height, width }) {
  return (
    <div>
      <iframe
        data-testid="iframe"
        src={link}
        height={height}
        width={width}
        style={{ border: 0, position: 'fixed' }}
      />
    </div>
  );
}

IframeContainer.propTypes = {
  link: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};
