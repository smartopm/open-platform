import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { capitalize } from '../../utils/helpers'

export default function DeleteDialogueBox({
  open,
  handleClose,
  handleDelete,
  title,
  action
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
          {`${capitalize(action)} ${capitalize(title)}`} 
        </DialogTitle>
        <DialogContent>
          { `Are you sure you want to ${action} this ${title} ?` }
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

DeleteDialogueBox.defaultProps = {
  action: 'delete'
}

DeleteDialogueBox.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  action: PropTypes.string
}