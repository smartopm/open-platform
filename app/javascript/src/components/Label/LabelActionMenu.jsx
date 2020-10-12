/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import EditModal from './EditModal'

export default function LabelActionMenu({
  data,
  anchorEl,
  handleClose,
  open,
  refetch
}) {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <Menu
      id={`long-menu-${data.id}`}
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
            id="edit_button"
            key="edit_user"
            onClick={() => setOpenEdit(true)}
          >
            Edit
          </MenuItem>
          <MenuItem
            id="delete_button"
            key="delete_user"
          >
            Delete
          </MenuItem>
          <EditModal open={openEdit} handleClose={() => setOpenEdit(false)} refetch={refetch} data={data} />
        </>
      </div>
    </Menu>
  );
}
