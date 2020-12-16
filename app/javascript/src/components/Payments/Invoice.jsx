import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { useQuery, useMutation } from 'react-apollo'
import CenteredContent from '../CenteredContent'
import { CustomizedDialogs } from '../Dialog'
import { UserLandParcel } from '../../graphql/queries'
import { InvoiceCreate } from '../../graphql/mutations'
import DatePickerDialog from '../DatePickerDialog'
import MessageAlert from "../MessageAlert"
import Loading from '../Loading'
import ErrorPage from '../Error'
import { formatError } from '../../utils/helpers'

export default function AddInvoices({ userId }){
  const classes = useStyles();
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState({})
  const [createInvoice] = useMutation(InvoiceCreate)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const {
    loading, error, data
  } = useQuery(UserLandParcel, {
    variables: { userId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

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
      setOpen(false)
    }).catch((err) => {
      setOpen(false);
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  if (loading) return <Loading />
  if (error) return <ErrorPage error={error.message} />

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <CenteredContent>
        <Button variant="contained" data-testid="invoice-button" color="primary" onClick={() => setOpen(true)}>Create Invoice</Button>
        <CustomizedDialogs 
          open={open} 
          handleModal={() => setOpen(false)}
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
              {data?.userLandParcel.map(land => (
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
              value={inputValue.description}
              onChange={(event) => setInputValue({...inputValue, description: event.target.value})}
              multiline
            />
            <TextField
              margin="dense"
              id="note"
              label="Note"
              value={inputValue.note}
              onChange={(event) => setInputValue({...inputValue, note: event.target.value})}
              multiline
            />
          </div>
        </CustomizedDialogs>
      </CenteredContent>
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

AddInvoices.propTypes = {
  userId: PropTypes.string.isRequired
}