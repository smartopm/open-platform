/* eslint-disable */
import React from 'react'
import { Menu, MenuItem, IconButton } from '@material-ui/core'

export default function ActionCardMenu({ data, open, handleClose, anchorEl }) {
  function handleClick(event) {
    console.log('click')
  }

  return (
    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: 252
        }
      }}
    >
      <div>
        <MenuItem
          id="edit_button"
          key={'edit'}
          onClick={handleClick}
        >
          Edit
        </MenuItem>
        <MenuItem
          key={'activate'}
          onClick={handleClick}
        >
          Activate
        </MenuItem>
        <MenuItem
          key={'delete'}
          onClick={handleClick}
        >
          Delete
        </MenuItem>
      </div>
    </Menu>
  )
}
