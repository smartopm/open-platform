import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@mui/material';

export default function Label({ color, title, borderRadius, width, groupingName }) {
  const isMobile = useMediaQuery('(max-width:800px)');
  return !groupingName ? (
    <p
      style={{
        textAlign: 'center',
        background: color,
        padding: '9px',
        color: 'white',
        borderRadius,
        fontSize: '12px',
        width,
        marginTop: isMobile && 8
      }}
      className="custom-label"
    >
      {title}
    </p>
  ) : (
    <p
      style={{
        marginTop: isMobile && 8
      }}
    >
      <span
        style={{
          background: 'white',
          color,
          marginTop: 20,
          fontSize: '12px',
          width: 'fit-content',
          padding: '8px',
          borderTop: '1px solid',
          borderLeft: '1px solid',
          borderColor: color,
          borderBottom: '1px solid',
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px'
        }}
      >
        {' '}
        {groupingName}
      </span>
      <span
        style={{
          background: color,
          color: 'white',
          fontSize: '12px',
          width: 'fit-content',
          padding: '9px',
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px'
        }}
      >
        {title}
      </span>
    </p>
  );
}

Label.defaultProps = {
  borderRadius: '16px',
  width: 'fit-content',
  groupingName: ''
};

Label.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  borderRadius: PropTypes.string,
  width: PropTypes.string,
  groupingName: PropTypes.string
};
