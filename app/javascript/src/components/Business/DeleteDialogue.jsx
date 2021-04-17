import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton
} from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import {Spinner} from '../../shared/Loading'

export default function DeleteDialogueBox({
  open,
  handleClose,
  handleAction,
  title,
  action,
  user,
  additionalNote,
  loading
}) {
  const classes = useStyles();
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.title}>
          <WarningIcon style={{paddingTop: '10px'}} />
          <span style={{fontSize: '14px', margin: '0 30px 0 7px'}}>{ `Are you sure you want to ${action} this ${title}?` }</span>
          <IconButton style={{paddingTop: '5px', color: '#dc402b'}} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{margin: '30px 0', fontSize: '13px', textAlign: 'center'}}>
          { `You are about to ${action} ${title} ${user ? `for ${user}` : null}` }
          <br />
          <b>{ additionalNote ? `Note:- ${additionalNote}` : null }</b>
        </DialogContent>
        <Divider />
        <DialogActions>
          {loading ? (<Spinner />) : ( 
            <>
              <Button onClick={handleClose} color="secondary" variant='outlined'>
                close
              </Button>
              <Button onClick={handleAction} variant='contained' className={classes.button} autoFocus data-testid="confirm_action">
                {action}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

DeleteDialogueBox.defaultProps = {
  action: 'delete',
  user: '',
  additionalNote: '',
  loading: false
}

DeleteDialogueBox.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  action: PropTypes.string,
  user: PropTypes.string,
  additionalNote: PropTypes.string,
  loading: PropTypes.bool
}

const useStyles = makeStyles({
  title: {
    backgroundColor: '#fcefef',
    color: '#dc402b',
    borderBottom: '1px #f1a3a2 solid'
  },
  button: {
    backgroundColor: '#dc402b', 
    color: 'white'
  }
});