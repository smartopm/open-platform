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
  IconButton,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next';
import { titleize } from '../utils/helpers'
import {Spinner} from '../shared/Loading'

export function ModalDialog({
  handleClose,
  open,
  handleConfirm,
  action,
  name,
  children
}) {
  const { t } = useTranslation(['logbook', 'common'])
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogContent>
        {Boolean(name.length) && (
          <p className="deny-msg">
            {t('logbook.grant_deny_access', { action, name })}
          </p>
        )}
        <div>{children}</div>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleConfirm}
          color={
            ['grant', 'acknowledge', 'save', 'proceed'].includes(action)
              ? 'primary'
              : 'secondary'
          }
        >
          {action}
        </Button>
        <Button className="btn-close" onClick={handleClose}>
          {t('common:form_actions.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function ReasonInputModal({ handleAddReason, handleClose, open, children }) {
  const { t } = useTranslation(['logbook', 'common'])
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
      maxWidth="lg"
    >
      <DialogContent>
        <p className="deny-msg">{t('logbook.other_reason')}</p>
        <br />
        {children}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleAddReason} color="primary">
          {t('common:form_actions.save')}
        </Button>
        <Button className="btn-close" onClick={handleClose}>
          {t('common:form_actions.cancel')}
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
  cancelAction,
  actionable,
  actionLoading
}) {
  const classes = useStyles()
  return (
    <Dialog
      onClose={handleModal}
      aria-labelledby="simple-dialog-title"
      open={open}
      data-testid="dialog"
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
      {
        actionable && (
          <DialogActions>
            {actionLoading ? (<Spinner />) : (
              <>
                <Button onClick={handleModal} variant="outlined" color="secondary" data-testid='dialog_cancel'>
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
              </>
            )}
          </DialogActions>
        )
      }
    </Dialog>
  )
}

export function DetailsDialog({ handleClose, open, title, children, noActionButton, color }){
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
          <Button onClick={handleClose} variant="outlined" color={color} data-testid='cancel'>
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export function FullScreenDialog({ handleClose, open, children, actionText, handleSubmit }){
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
          <Button autoFocus onClick={handleSubmit} style={{background: 'none'}} className={classes.print}>
            {actionText}
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
export function ActionDialog({ handleClose, open, handleOnSave, message, type}) {
  const { t } = useTranslation('common')
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
          {t('form_actions.cancel')}
        </Button>
        <Button
          autoFocus
          onClick={handleOnSave}
          variant="contained"
          color="primary"
        >
          {t('menu.proceed')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const useStyles = makeStyles(theme => ({
  title: {
    borderBottom: '1px #b8d4d0 solid'
  },
  ActionDialogTitle: {
    backgroundColor: '#fcefef',
    color: '#dc402b',
    borderBottom: '1px #f1a3a2 solid'
  },
  confirmDialogTitle: {
    color: theme.palette.primary.main,
    borderBottom: `1px ${theme.palette.primary.main} solid`
  },
  detailTitle: {
    color: theme.palette.primary.main
  },
  close: {
    float: 'right',
    marginTop: '2px',
    marginLeft: '200px',
    cursor: 'pointer'
  },
  appBar: {
    position: 'relative',
    color: '#FFFFFF',
  },
  print: {
    marginLeft: '500px',
    width: '30px',
    flex: 1,
    color: '#FFFFFF'
  },
  drawer: {
    width: '300px',
  },
}))

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
  actionText: PropTypes.string.isRequired,
  children: PropTypes.node
}

DetailsDialog.defaultProps = {
  children: {},
  noActionButton: false,
  color: 'secondary'
}

DetailsDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  noActionButton: PropTypes.bool,
  color: PropTypes.string
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
  cancelAction: 'Cancel',
  actionable: true,
  actionLoading: false
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
  disableActionBtn: PropTypes.bool,
  actionable: PropTypes.bool,
  actionLoading: PropTypes.bool
}

ModalDialog.defaultProps = {
  name: '',
  action: 'Save',
  children: <span />
}

ReasonInputModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  handleAddReason: PropTypes.func.isRequired,
}

MapEditorFullScreenDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}
