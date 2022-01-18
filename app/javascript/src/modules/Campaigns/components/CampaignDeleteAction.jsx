/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { DeleteCampaign } from '../../../graphql/mutations'
import CampaignDeleteDialogue from './CampaignDeleteDialogue'

// This looks very similar to changes on master, you can merge and reuse the action menu. 
export default function CampaignDelete({
  data,
  refetch
}) {
  const [openModal, setOpenModal] = useState(false)
  const [deleteCampaign] = useMutation(DeleteCampaign)
  function handleDeleteClick() {
    setOpenModal(!openModal)
  }
  function handleDelete() {
    deleteCampaign({
      variables: { id: data.id }
    }).then(() => {
      handleDeleteClick()
      refetch()
    })
  }
  return (
    <div>
      <IconButton
        aria-label="delete"
        aria-controls="delete-icon"
        aria-haspopup="true"
        onClick={handleDeleteClick}
      >
        <DeleteIcon data-testid="deleteIcon" color="primary" />
      </IconButton>
      {openModal && (
      <CampaignDeleteDialogue handleClose={handleDeleteClick} handleDelete={handleDelete} open={openModal} /> 
      )}
    </div>
  )
}
