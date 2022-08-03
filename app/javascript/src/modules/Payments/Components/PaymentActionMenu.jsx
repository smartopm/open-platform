import React from 'react';
import PropTypes from 'prop-types'
import { Menu } from '@mui/material';

export default function ActionMenu({
  anchorEl,
  handleClose,
  open,
  children
}) {

  return (
    <Menu
      id='long-menu'
      anchorEl={anchorEl}
      open={open}
      keepMounted
      onClose={handleClose}
      PaperProps={{
        style: {
          width: 200
        }
      }}
    >
      <div>
        <>
          {children}
        </>
      </div>
    </Menu>
  );
}

ActionMenu.defaultProps = {
  anchorEl: {},
  children: {} 
 }
 ActionMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object 
}
