/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React from 'react';
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
          onClick={() => menu.handleClick(anchorEl.getAttribute('dataid'))}
        >
          {menu.content}
        </MenuItem>
        )
      )}
    </Menu>
  );
}
