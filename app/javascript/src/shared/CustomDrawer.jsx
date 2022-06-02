import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function CustomDrawer({ children, open }) {
  const xsMatches = useMediaQuery('(max-width:600px)');
  const smMatches = useMediaQuery('(max-width:900px)');
  return (
    <>
      {open && (
        <div
          style={{
            width: `${xsMatches ? '100%' : smMatches ? '50%' : '25%'}`,
            height: '100vh',
            zIndex: '10000',
            position: 'fixed',
            right: 0,
            padding: '20px',
            overflow: 'auto'
          }}
          className="drawer"
        >
          {children}
        </div>
      )}
    </>
  );
}

CustomDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.string.isRequired
};
