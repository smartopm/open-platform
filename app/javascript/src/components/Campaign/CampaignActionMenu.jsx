import React, { useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import { DeleteCampaign } from '../../graphql/mutations'
import CampaignDeleteDialogue from './CampaignDeleteDialogue'


// This looks very similar to changes on master, you can merge and reuse the action menu. 
export default function CampaignActionMenu({
  data,
  anchorEl,
  handleClose,
  userType,
  open,
  linkStyles,
  refetch
}) {
  const [openModal, setOpenModal] = useState(false)
  const [deleteCampaign] = useMutation(DeleteCampaign)
  function handleDeleteClick() {
    handleClose()
    setOpenModal(!openModal)
  }
  function handleDelete() {
    deleteCampaign({
      variables: { id: data.id }
    }).then(() => {
      handleClose()
      refetch()
    })
  }
  return (
    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={handleClose}
    >
      <div>
        { userType == 'admin' && (
        <>
          { (data.status === 'draft' || data.status === 'scheduled') && (<MenuItem
            id="delete_button"
            key="delete_user"
            onClick={() => handleDeleteClick()}
          >
            Delete
          </MenuItem>)}
          <MenuItem>
            <Link to={`/campaign/${data.id}`} className={linkStyles}>
              View Details
            </Link>
          </MenuItem>
          <CampaignDeleteDialogue
            open={openModal}
            handleClose={handleDeleteClick}
            handleDelete={handleDelete}
          />
        </>
        )}
      </div>
    </Menu>
  )
}
