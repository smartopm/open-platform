/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { useMutation } from 'react-apollo'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteLabel } from '../../graphql/mutations'

export default function TaskDelete({ open, handleClose, refetch, data }) {
  const classes = useStyles();
  const [labelDelete] = useMutation(DeleteLabel)
  const [error, setErrorMessage] = useState('')

  function handleDelete(comId) {
    labelDelete({ variables: {
      id: comId
    }}).then(() => {
      handleClose()
      refetch()
    }).catch((err) => {
      handleClose()
      setErrorMessage(err)
    })
  }

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} className={classes.title}>
          Are you sure you want to delete this label?
        </DialogTitle>
        <DialogContent style={{ margin: '15px', textAlign: "center" }}>
          You are about to delete the
          {' '}
          <b>{data.shortDesc}</b>
          {' '}
          label
        </DialogContent>
        <Divider />
        <DialogActions style={{ margin: '10px' }}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button autoFocus onClick={() => handleDelete(data.id)} variant="contained" style={{ backgroundColor: '#dc402b', color: 'white' }}>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
      <p className="text-center">
        {Boolean(error.length) && error}
      </p>
    </>
  )
}

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  title: {
    backgroundColor: '#fcefef',
    color: '#dc402b',
    borderBottom: '1px #f1a3a2 solid'
  },
  deleteCard: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

 TaskDelete.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    shortDesc: PropTypes.string
    }).isRequired,
  refetch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
 }
