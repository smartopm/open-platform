/* eslint-disable no-use-before-define */
import React from 'react'
import CloseIcon from '@material-ui/icons/Close';
import {
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  DialogContentText,
  DialogTitle,
  Divider,
  AppBar,
  Toolbar,
  IconButton
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { titleize } from '../utils/helpers'

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
            // eslint-disable-next-line security/detect-non-literal-regexp
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
  disableActionBtn,
  cancelAction
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
          {cancelAction}
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

export function DetailsDialog({ handleClose, open, title, children, noActionButton }){
  const classes = useStyles()
  return(
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        className={classes.detailTitle}
      >
        {title}
      </DialogTitle>
      <Divider />
      {children}
      <Divider />
      {!noActionButton && (
        <DialogActions style={{ margin: '10px' }}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export function FullScreenDialog({ handleClose, open, children, handleSubmit }){
  const classes = useStyles()
  return(
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon style={{color: 'white'}} />
          </IconButton>
          <div className={classes.print}>
            {' '}
          </div>
          <Button autoFocus color="inherit" onClick={handleSubmit} style={{background: 'none'}} className={classes.print}>
            Print
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  )
}

export function MapEditorFullScreenDialog({ handleClose, open, children }){
  const classes = useStyles()
  return(
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon style={{color: 'white'}} />
          </IconButton>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  )
}

export function LandParcelMergeFullScreenModal({ handleClose, open, children, handleSubmit }){
  const classes = useStyles()
  return(
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon style={{color: 'white'}} />
          </IconButton>
          <div className={classes.print}>
            {' '}
          </div>
          <Button autoFocus color="inherit" onClick={handleSubmit} style={{background: 'none'}} className={classes.print}>
            Merge and Save
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  )
}
export function ActionDialog({ handleClose, open, handleOnSave, message, type}) {
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
        className={type === 'warning' ? classes.ActionDialogTitle  : classes.confirmDialogTitle}
      >
        { titleize(type) }
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
          style={{ backgroundColor: type === 'warning' ? '#dc402b' : '#69ABA4', color: 'white' }}
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const useStyles = makeStyles({
  title: {
    borderBottom: '1px #b8d4d0 solid'
  },
  ActionDialogTitle: {
    backgroundColor: '#fcefef',
    color: '#dc402b',
    borderBottom: '1px #f1a3a2 solid'
  },
  confirmDialogTitle: {
    color: '#69ABA4',
    borderBottom: '1px #69ABA4 solid'
  },
  detailTitle: {
    background: '#FAFEFE',
    color: '#81B7AD'
  },
  close: {
    float: 'right',
    marginTop: '2px',
    marginLeft: '200px',
    cursor: 'pointer'
  },
  appBar: {
    position: 'relative',
  },
  print: {
    marginLeft: '500px',
    width: '30px',
    flex: 1
  },
})

ActionDialog.defaultProps = {
  type: 'warning'
}

ActionDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['warning', 'confirm']),
  handleOnSave: PropTypes.func.isRequired,
}

FullScreenDialog.defaultProps = {
  children: {}
}

FullScreenDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.node
}

LandParcelMergeFullScreenModal.defaultProps = {
  children: {}
}

LandParcelMergeFullScreenModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.node
}

DetailsDialog.defaultProps = {
  children: {},
  noActionButton: null
}

DetailsDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  noActionButton: PropTypes.bool
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
  disableActionBtn: false,
  cancelAction: 'Cancel'
}

CustomizedDialogs.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  handleBatchFilter: PropTypes.func.isRequired,
  handleModal: PropTypes.func.isRequired,
  dialogHeader: PropTypes.string,
  subHeader: PropTypes.string,
  saveAction: PropTypes.string,
  cancelAction: PropTypes.string,
  disableActionBtn: PropTypes.bool
}

ModalDialog.defaultProps = {
  name: '',
  action: 'Save',
  children: <span />
}

ReasonInputModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}

MapEditorFullScreenDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}