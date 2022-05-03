import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function PageWrapper({ children }) {
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <div style={!matches ? { padding: '0 25%' } : { padding: '20px' }}>
      {children}
    </div>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired
}