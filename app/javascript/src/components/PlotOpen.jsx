/* eslint-disable no-use-before-define */
import React, {useState} from 'react'
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { useMutation } from 'react-apollo'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { AddPlotNumber } from '../graphql/mutations'
import MessageAlert from "./MessageAlert"
import { formatError } from "../utils/helpers"

export default function PlotModal({ open, handleClose, userId, accountId, refetch }) {
  const classes = useStyles();
  const [addPlot] = useMutation(AddPlotNumber)
  const [parcelNumber, setParcelNumber] = useState('')
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  function handleAddPlotNumber(event) {
    event.preventDefault()
    addPlot({ variables: {
      userId,
      accountId,
      parcelNumber
    }}).then(() => {
      setMessageAlert('Plot number added successfully')
      setIsSuccessAlert(true)
      handleClose()
      refetch()
    }).catch(err => {
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
      handleClose()
    })
  }

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} className={classes.title}>
          Add Plot
        </DialogTitle>
        <form onSubmit={handleAddPlotNumber}>
          <DialogContent style={{ margin: '15px' }}>
            <Typography variant='body1'><b>Add a new plot associated with this user</b></Typography>
            <TextField autoFocus id="standard-basic" label="Plot Number" style={{width: '100%'}} onChange={e => setParcelNumber(e.target.value)} />
          </DialogContent>
          <Divider />
          <DialogActions style={{ margin: '10px' }}>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button variant="contained" type="submit" style={{ backgroundColor: '#66a59a', color: 'white' }}>
              Save changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
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
    backgroundColor: '#fafefe',
    color: '#66a59a',
    borderBottom: '1px #dfedea solid',
    textAlign: 'center'
  },
  deleteCard: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

PlotModal.defaultProps = {
  userId: '',
  accountId: ''
 }
 PlotModal.propTypes = {
   userId: PropTypes.string,
   refetch: PropTypes.func.isRequired,
   open: PropTypes.bool.isRequired,
   handleClose: PropTypes.func.isRequired,
   accountId: PropTypes.string
 }
