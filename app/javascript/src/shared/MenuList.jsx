/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types'
import { Menu, MenuItem } from '@mui/material';

export default function MenuList({
  list,
  anchorEl,
  handleClose,
  userType,
  open
}) {
  let listData = list
  if (userType && userType !== 'admin') {
    listData = list.filter(lis => lis.isAdmin === false)
  }
  return (
    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      open={open}
      keepMounted
      data-testid="menu_list"
      onClose={event => handleClose(event)}
    >
      {listData.map((menu, index) => (
        <MenuItem
          data-testid="menu_item"
          id={index}
          key={index}
          style={menu.color ? { color: menu.color } : null}
          onClick={event =>
            menu.handleClick(
              event,
              anchorEl?.getAttribute('dataid'),
              anchorEl?.getAttribute('name')
            )
          }
        >
          {menu.content}
        </MenuItem>
      ))}
    </Menu>
  );
}

MenuList.defaultProps = {
  anchorEl: {},
  userType: null
}

MenuList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  userType: PropTypes.string
}
