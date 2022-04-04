import React from 'react';
import PropTypes from 'prop-types';

export default function ListWrapper({ children }) {
  return (
    <div style={{ background: '#F5F5F4', padding: '10px 15px', borderRadius: '10px' }}>
      {children}
    </div>
  );
}

ListWrapper.propTypes = {
  children: PropTypes.node.isRequired
}