import React from 'react'
import { DialogContent, DialogActions, Button, Dialog, DialogContentText, DialogTitle } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types'
export function ModalDialog({
  handleClose,
  open,
  handleConfirm,
  action,
  name,
  children
}) {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogContent>
        {
          Boolean(name.length) && (
            <p className="deny-msg">
              Are you sure you want to {action} access to <strong>{name}</strong> ?
            </p>
          )
        }
        <div>{children}</div>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleConfirm}
          color={
            new RegExp(action).test(/grant|acknowledge/)
              ? 'primary'
              : 'secondary'
          }
        >
          {action}
        </Button>
        <Button className="btn-close" onClick={handleClose}>
          Never Mind
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function ReasonInputModal({ handleClose, open, children }) {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth={'lg'}
    >
      <DialogContent>
        <p className="deny-msg">Other Business</p>
        <br />
        {children}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color={'primary'}>
          Save
        </Button>
        <Button className="btn-close" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function CustomizedDialogs({
  children,
  open,
  handleBatchFilter,
  handleModal,
  dialogHeader,
  subHeader,
  saveAction
}) {
  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle>
        <div className="d-flex justify-content-between">
          <h6>{dialogHeader}</h6>
          <CloseIcon onClick={handleModal} />
        </div>
      </DialogTitle>
      <DialogContent>
        {subHeader ? <DialogContentText>
          {subHeader}
        </DialogContentText>
          : null}
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBatchFilter} color={'primary'}>
          {saveAction}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


ModalDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string,
  action: PropTypes.string,
  handleConfirm: PropTypes.func.isRequired,
  children: PropTypes.node
}

CustomizedDialogs.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  handleBatchFilter: PropTypes.func.isRequired,
  handleModal: PropTypes.func.isRequired,
  dialogHeader: PropTypes.string,
  subHeade: PropTypes.string

}

ModalDialog.defaultProps = {
  name: '',
  action: 'Save'
}

ReasonInputModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

