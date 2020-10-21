/* eslint-disable react/prop-types */
/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import React, {useState, useEffect} from 'react'
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
import { EditPlotNumber } from '../graphql/mutations'

export default function EditPlotModal({ open, handleClose, data, refetch }) {
  const classes = useStyles();
  const [editPlot] = useMutation(EditPlotNumber)
  const [parcelNumber, setParcelNumber] = useState('')

  function handleEditPlotNumber(event) {
    event.preventDefault()
    editPlot({ variables: {
      id: data.id,
      parcelNumber
    }}).then(() => {
      refetch()
      handleClose()
    })
  }

  useEffect(() => {
    setParcelNumber(data.parcelNumber)
  }, [data])

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} className={classes.title}>
          Edit Plot
        </DialogTitle>
        <form onSubmit={handleEditPlotNumber}>
          <DialogContent style={{ margin: '15px' }}>
            <Typography variant='body1'><b>Edit plot associated with this user</b></Typography>
            <TextField 
              autoFocus 
              id="standard-basic" 
              label="Plot Number" 
              style={{width: '100%'}} 
              onChange={e => setParcelNumber(e.target.value)}
              value={parcelNumber}
            />
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

EditPlotModal.propTypes = {
   open: PropTypes.bool.isRequired,
   handleClose: PropTypes.func.isRequired
 }
