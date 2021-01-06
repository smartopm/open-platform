import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import { capitalize } from '../../utils/helpers'

export default function DeleteDialogueBox({
  open,
  handleClose,
  handleAction,
  title,
  action
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
          {`${capitalize(action)} ${capitalize(title)}`} 
        </DialogTitle>
        <DialogContent>
          { `Are you sure you want to ${action} this ${title} ?` }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            No
          </Button>
          <Button onClick={handleAction} color="primary" className={classes.button} autoFocus>
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
  handleAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  action: PropTypes.string
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