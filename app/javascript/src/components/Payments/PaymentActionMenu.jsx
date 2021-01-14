import React from 'react';
import PropTypes from 'prop-types'
import { Menu, MenuItem } from '@material-ui/core';

export default function LabelActionMenu({
  anchorEl,
  handleClose,
  open
}) {

  return (
    <Menu
      id='menu-view'
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
          <MenuItem
            id="view-button"
            key="view-user"
          >
            View
          </MenuItem>
          <MenuItem
            id="edit-button"
            key="edit-user"
          >
            Edit
          </MenuItem>
          <MenuItem
            id="cancel-button"
            key="cancel-user"
            style={{ color: 'red' }}
          >
            Cancel Invoice
          </MenuItem>
        </>
      </div>
    </Menu>
  );
}

LabelActionMenu.defaultProps = {
  anchorEl: {}
 }
LabelActionMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object 
}
