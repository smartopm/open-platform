import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { CustomizedDialogs } from '../../../../components/Dialog'
import DatePickerDialog from '../../../../components/DatePickerDialog'
import { extractCurrency, formatError } from '../../../../utils/helpers'
import { InvoiceCreate } from '../../../../graphql/mutations'
import MessageAlert from "../../../../components/MessageAlert"
import { UserLandParcel } from '../../../../graphql/queries'
import { Spinner } from '../../../../shared/Loading'

const initialValues = {
  status: 'in_progress',
  parcelId: '',
  selectedDate: new Date(),
  amount: '',
  note: ''
}
export default function InvoiceModal({ open, handleModalClose, userId, refetch, currencyData, depRefetch, walletRefetch }) {
  const classes = useStyles();
  const history = useHistory()
  const [inputValue, setInputValue] = useState(initialValues)
  const [createInvoice] = useMutation(InvoiceCreate)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [isError, setIsError] = useState(false)
  const [submitting, setIsSubmitting] = useState(false)

  const [loadLandParcel, { loading, data } ] = useLazyQuery(UserLandParcel,{
    variables: { userId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  const handleSubmit = event => {
    event.preventDefault()

    if (!inputValue.parcelId || !inputValue.amount) {
      setIsError(true)
      setIsSubmitting(true)
      return
    }
    createInvoice({
      variables: {
        landParcelId: inputValue.parcelId,
        description: inputValue.description,
        note: inputValue.note,
        amount: parseFloat(inputValue.amount),
        dueDate: inputValue.selectedDate,
        status: inputValue.status,
        userId
      }
    }).then(() => {
      setMessageAlert('Invoice added successfully')
      setIsSuccessAlert(true)
      setInputValue(initialValues)
      refetch()
      depRefetch()
      walletRefetch()
      handleModalClose()
      history.push(`/user/${userId}?tab=Payments`)
    }).catch((err) => {
      handleModalClose()
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
      history.push(`/user/${userId}?tab=Payments`)
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  useEffect(() => {
    if (open) {
      loadLandParcel({variables: { userId },
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (loading) return <Spinner />

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
            error={isError && submitting && !inputValue.parcelId}
            helperText={isError && !inputValue.parcelId && 'Plot No is required'}
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
            value={inputValue.amount}
            onChange={(event) => setInputValue({...inputValue, amount: event.target.value})}
            InputProps={{
            startAdornment: <InputAdornment position="start">{extractCurrency(currencyData)}</InputAdornment>,
                "data-testid": "amount",
                type: "number",
                step: '0.01'
              }}
            required
            error={isError && submitting && !inputValue.amount}
            helperText={isError && !inputValue.amount && 'amount is required'}
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
  userId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  depRefetch: PropTypes.func.isRequired,
  walletRefetch: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
}
