import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'

export default function DeleteDialogueBox({
  open,
  handleClose,
  handleDelete
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
          <Button onClick={handleClose} color="secondary">
            No
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
