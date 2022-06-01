import React from 'react';
// import Drawer from '@mui/material/Drawer';
import PropTypes from 'prop-types';

export default function CustomDrawer({ children, open }) {
  return (
    <>
      {open && (
        <div style={{ width: '25%', height: '100vh', zIndex: '10000', position: 'fixed', right: 0, padding: '20px' }} className='drawer'>
          {children}
        </div>
      )}
    </>
  );
}

CustomDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.string.isRequired,
};
