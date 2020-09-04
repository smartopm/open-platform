/* eslint-disable */
import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import { Link } from 'react-router-dom'


export default function BusinessActionMenu({
  data,
  anchorEl,
  handleClose,
  authState: { user: { userType } },
  open,
  linkStyles
}) {
  return (
    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: 200
        }
      }}
    >
      <div>
        {userType === "admin" && (
          <>
            <MenuItem
              id="delete_button"
              key={'delete_user'}
              onClick={() => data}
            >
              Delete
              </MenuItem>
            <MenuItem
              key={'view_details'}
              onClick={data}
            >
              View Details
              </MenuItem>
          </>
        )}
      </div>
    </Menu>
  )
}