import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { CustomizedDialogs } from '../Dialog'
import DatePickerDialog from '../DatePickerDialog'
import { formatError } from '../../utils/helpers'
import { InvoiceCreate } from '../../graphql/mutations'
import MessageAlert from "../MessageAlert"

export default function InvoiceModal({ open, handleModalClose, data, userId }) {
  const classes = useStyles();
  const history = useHistory()
  const [inputValue, setInputValue] = useState({})
  const [createInvoice] = useMutation(InvoiceCreate)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    createInvoice({
      variables: { 
        landParcelId: inputValue.parcelId,
        description: inputValue.description,
        note: inputValue.note,
        amount: inputValue.amount,
        dueDate: inputValue.selectedDate,
        status: inputValue.status
      }
    }).then(() => {
      setMessageAlert('Invoice added successfully')
      setIsSuccessAlert(true)
      setInputValue({})
      handleModalClose()
      history.push(`/user/${userId}`)
    }).catch((err) => {
      handleModalClose()
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
      history.push(`/user/${userId}`)
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <CustomizedDialogs 
        open={open} 
        handleModal={handleModalClose}
        dialogHeader='Add a New Invoice'
        handleBatchFilter={handleSubmit}
      >
        <div className={classes.invoiceForm}>
          <TextField
            autoFocus
            margin="dense"
            id="parcel-number"
            inputProps={{ "data-testid": "parcel-number" }}
            label="Plot No"
            value={inputValue.parcelId}
            onChange={(event) => setInputValue({...inputValue, parcelId: event.target.value})}
            required
            select
          >
            {data.map(land => (
              <MenuItem value={land.id} key={land.id}>{land.parcelNumber}</MenuItem>
              ))}
          </TextField>
          <DatePickerDialog 
            selectedDate={inputValue.selectedDate}
            handleDateChange={(date) => setInputValue({...inputValue, selectedDate: date})}
            label='Due Date'
            required
          />
          <TextField
            margin="dense"
            id="amount"
            label="Amount"
            type='number'
            value={inputValue.amount}
            onChange={(event) => setInputValue({...inputValue, amount: event.target.value})}
            InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                "data-testid": "amount"
              }}
            required
          />
          <TextField
            margin="dense"
            id="status"
            inputProps={{ "data-testid": "status" }}
            label="Status"
            value={inputValue.status}
            onChange={(event) => setInputValue({...inputValue, status: event.target.value})}
            required
            select
          >
            <MenuItem value='in_progress'>In progress</MenuItem>
            <MenuItem value='paid'>Paid</MenuItem>
            <MenuItem value='late'>Late</MenuItem>
            <MenuItem value='cancelled'>Cancelled</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            id="description"
            label="Description"
            inputProps={{ "data-testid": "description" }}
            value={inputValue.description}
            onChange={(event) => setInputValue({...inputValue, description: event.target.value})}
            multiline
          />
          <TextField
            margin="dense"
            id="note"
            label="Note"
            inputProps={{ "data-testid": "note" }}
            value={inputValue.note}
            onChange={(event) => setInputValue({...inputValue, note: event.target.value})}
            multiline
          />
        </div>
      </CustomizedDialogs>
    </>
  )
}

const useStyles = makeStyles({
  invoiceForm: {
    display: 'flex', 
    flexDirection: 'column',
    width: '400px'
  }
});

InvoiceModal.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    parcelNumber: PropTypes.string.isRequired
  })).isRequired,
  userId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired
}