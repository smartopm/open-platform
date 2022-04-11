import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ListWrapper({ children }) {
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <div style={!matches ? { padding: '0 25%' } : { padding: '20px' }}>
      {children}
    </div>
  );
}

ListWrapper.propTypes = {
  children: PropTypes.node.isRequired
}