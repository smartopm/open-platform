import React from 'react';
import PropTypes from 'prop-types';

export default function Label({ color, title }) {
  return (
    <p
      style={{
        textAlign: 'center',
        background: color,
        padding: '9px',
        color: 'white',
        borderRadius: '15px',
        width: 120
      }}
    >
      {title}
    </p>
  );
}

Label.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};
