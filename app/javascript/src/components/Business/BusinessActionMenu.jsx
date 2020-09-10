import React, { useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import { useMutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import { DeleteBusiness } from '../../graphql/mutations'
import BusinessDeleteDialogue from './BusinessDeleteDialogue'


export default function BusinessActionMenu({
  data,
  anchorEl,
  handleClose,
  userType,
  open,
  linkStyles,
  refetch
}) {
  const [openModal, setOpenModal] = useState(false)
  const [deleteBusiness] = useMutation(DeleteBusiness)
  function handleDeleteClick() {
    handleClose()
    setOpenModal(!openModal)
  }
  function handleDelete() {
    deleteBusiness({
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
              key="delete_user"
              onClick={() => handleDeleteClick()}
            >
              Delete
            </MenuItem>
            <MenuItem>
              <Link
                to={`/business/${data.id}`}
                className={linkStyles}
              >
                View Details
              </Link>
            </MenuItem>
            
            <BusinessDeleteDialogue
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