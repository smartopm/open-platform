/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types'
import { Menu, MenuItem } from '@material-ui/core';

export default function MenuList({
  list,
  anchorEl,
  handleClose,
  userType,
  open
}) {
  let listData = list
  if (userType !== 'admin') {
    listData = list.filter(lis => lis.isAdmin === false) 
  }
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
      {listData.map((menu, index) => (
        <MenuItem
          id={index}
          key={index}
          style={menu.color ? {color: menu.color} : null}
          onClick={() => menu.handleClick(anchorEl.getAttribute('dataid'), anchorEl.getAttribute('name'))}
        >
          {menu.content}
        </MenuItem>
        )
      )}
    </Menu>
  );
}

MenuList.defaultProps = {
  anchorEl: {},
}

MenuList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired
}
