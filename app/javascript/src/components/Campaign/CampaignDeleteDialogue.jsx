/* eslint-disable react/prop-types */
import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'

export default function DeleteDialogueBox({
  handleClose,
  handleDelete,
  open
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Campaign
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this campaign?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" data-testid='no'>
            No
          </Button>
          <Button onClick={handleDelete} color="primary" data-testid='yes' autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
