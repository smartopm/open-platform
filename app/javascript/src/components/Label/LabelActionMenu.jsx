import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Menu, MenuItem } from '@material-ui/core';
import EditModal from './EditModal'
import DeleteModal from './LabelDelete'
import MergeLabel from './MergeLabel'

export default function LabelActionMenu({
  data,
  anchorEl,
  handleClose,
  open,
  refetch
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false)
  const [openMerge, setOpenMerge] = useState(false)

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
            id="merge_button"
            key="merge_user"
            onClick={() => setOpenMerge(true)}
          >
            Merge
          </MenuItem>
          <MenuItem
            id="delete_button"
            key="delete_user"
            style={{ color: 'red' }}
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </MenuItem>
          <EditModal open={openEdit} handleClose={() => setOpenEdit(false)} refetch={refetch} data={data} />
          <DeleteModal open={openDelete} handleClose={() => setOpenDelete(false)} refetch={refetch} data={data} />
          <MergeLabel open={openMerge} handleClose={() => setOpenMerge(false)} refetch={refetch} mergeData={data} /> 
        </>
      </div>
    </Menu>
  );
}

LabelActionMenu.defaultProps = {
  anchorEl: {}
 }
LabelActionMenu.propTypes = {
  data: PropTypes.shape({
      id: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object 
}
