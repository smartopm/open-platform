import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import { DialogContent, DialogActions, Button } from '@material-ui/core';
import PropTypes from 'prop-types'

export function ModalDialog({ handleClose, open, handleConfirm, action }){
    return(
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogContent>
        <p>Are you sure you want to <strong>{action}</strong> request <strong>#A5353</strong> ?</p>
      </DialogContent>
            <DialogActions>
        <Button autoFocus onClick={handleConfirm} color="secondary">
          Deny
        </Button>
        <Button onClick={handleClose} color="primary">
          Never Mind
        </Button>
      </DialogActions>
    </Dialog>
    )
}

ModalDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    handleConfirm: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired
}