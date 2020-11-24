/* eslint-disable no-use-before-define */
import React from 'react'
import {
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  DialogContentText,
  DialogTitle,
  Divider
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

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
        {Boolean(name.length) && (
          <p className="deny-msg">
            Are you sure you want to 
            {' '}
            {action}
            {' '}
            access to 
            {' '}
            <strong>{name}</strong>
            {' '}
            ?
          </p>
        )}
        <div>{children}</div>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleConfirm}
          color={
            new RegExp(action).test(/grant|acknowledge|save|proceed/)
              ? 'primary'
              : 'secondary'
          }
        >
          {action}
        </Button>
        <Button className="btn-close" onClick={handleClose}>
          Cancel
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
      fullWidth
      maxWidth="lg"
    >
      <DialogContent>
        <p className="deny-msg">Other Business</p>
        <br />
        {children}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
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
  saveAction,
  disableActionBtn
}) {
  const classes = useStyles()
  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle className={classes.title}>
        <div className="d-flex justify-content-between">
          <h6 data-testid="customDialog">{dialogHeader}</h6>
        </div>
      </DialogTitle>
      <DialogContent data-testid="customDialogcontent">
        {subHeader ? <DialogContentText>{subHeader}</DialogContentText> : null}
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModal} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          data-testid="custom-dialog-button"
          onClick={handleBatchFilter}
          color="primary"
          variant="contained"
          disabled={disableActionBtn}
        >
          {saveAction || 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function WarningDialog({ handleClose, open, handleOnSave, message }) {
  const classes = useStyles()
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        className={classes.WarningDialogTitle}
      >
        Warning
      </DialogTitle>
      <DialogContent style={{ margin: '15px', textAlign: 'center' }}>
        {message}
      </DialogContent>
      <Divider />
      <DialogActions style={{ margin: '10px' }}>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          autoFocus
          onClick={handleOnSave}
          variant="contained"
          style={{ backgroundColor: '#dc402b', color: 'white' }}
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles({
  title: {
    borderBottom: '1px #b8d4d0 solid'
  },
  WarningDialogTitle: {
    backgroundColor: '#fcefef',
    color: '#dc402b',
    borderBottom: '1px #f1a3a2 solid'
  }
})

WarningDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  handleOnSave: PropTypes.func.isRequired,
}

ModalDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string,
  action: PropTypes.string,
  handleConfirm: PropTypes.func.isRequired,
  children: PropTypes.node
}

CustomizedDialogs.defaultProps = {
  dialogHeader: '',
  subHeader: '',
  children: {},
  saveAction: 'Save',
  disableActionBtn: false
}

CustomizedDialogs.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  handleBatchFilter: PropTypes.func.isRequired,
  handleModal: PropTypes.func.isRequired,
  dialogHeader: PropTypes.string,
  subHeader: PropTypes.string,
  saveAction: PropTypes.string,
  disableActionBtn: PropTypes.bool
}

ModalDialog.defaultProps = {
  name: '',
  action: 'Save',
  children: {}
}

ReasonInputModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}
