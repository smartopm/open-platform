import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function ActionCardMenu({ data, open, handleClose, anchorEl, openFlowModal }) {
  function handleClick() {
    console.log('click')
  }

  function handleEdit() {
    openFlowModal(data.id)
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
          width: 100
        }
      }}
    >
      <div>
        <MenuItem
          id="edit_button"
          key="edit"
          onClick={handleEdit}
        >
          Edit
        </MenuItem>
        <MenuItem
          key="activate"
          onClick={handleClick}
        >
          Activate
        </MenuItem>
        <MenuItem
          key="delete"
          style={{ color: 'red' }}
          onClick={handleClick}
        >
          Delete
        </MenuItem>
      </div>
    </Menu>
  )
}

ActionCardMenu.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  openFlowModal: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object.isRequired,
}
