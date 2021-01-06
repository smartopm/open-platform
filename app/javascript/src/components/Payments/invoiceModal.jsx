import React, { useState, useEffect } from 'react'
import { useMutation, useLazyQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { CustomizedDialogs } from '../Dialog'
import DatePickerDialog from '../DatePickerDialog'
import { formatError } from '../../utils/helpers'
import { InvoiceCreate } from '../../graphql/mutations'
import MessageAlert from "../MessageAlert"
import PaymentModal from './PaymentModal'
import { UserLandParcel } from '../../graphql/queries'
import { Spinner } from '../Loading'

const initialValues = {
  status: '',
  parcelId: '',
  selectedDate: new Date(),
  amount: '',
  note: ''
}
export default function InvoiceModal({ open, handleModalClose, userId, creatorId, refetch, currency }) {
  const classes = useStyles();
  const history = useHistory()
  const [inputValue, setInputValue] = useState(initialValues)
  const [createInvoice] = useMutation(InvoiceCreate)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [openPayment, setOpenPayment] = useState(false)
  const [pay, setPay] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)
  const [loadLandParcel, { loading, data } ] = useLazyQuery(UserLandParcel,{
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
        amount: parseFloat(inputValue.amount),
        dueDate: inputValue.selectedDate,
        status: inputValue.status,
        userId
      }
    }).then((res) => {
      setMessageAlert('Invoice added successfully')
      setIsSuccessAlert(true)
      setInputValue(initialValues)
      refetch()
      if (pay) {
        handleModalClose()
        setInvoiceData(res.data.invoiceCreate.invoice)
        setOpenPayment(true)
        history.push(`/user/${userId}/invoices/${res.data.invoiceCreate.invoice.id}/add_payment`)
      } else {
        handleModalClose()
        history.push(`/user/${userId}`)
      }
    }).catch((err) => {
      handleModalClose()
      setMessageAlert(formatError(err.message))
      setIsSuccessAlert(false)
      history.push(`/user/${userId}`)
    })
  }

  function handlePaymentModalClose(){
    setOpenPayment(false)
    history.push(`/user/${userId}`)
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  function handleChange(event){
    setPay(event.target.checked)
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
            startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
                "data-testid": "amount",
                type: "number",
                step: '0.01'
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
          <FormControlLabel
            control={<Checkbox checked={pay} onChange={handleChange} name="pay" />}
            label="Make payment now"
          />
        </div>
      </CustomizedDialogs>
      <PaymentModal
        open={openPayment}
        handleModalClose={handlePaymentModalClose}
        invoiceData={invoiceData}
        userId={userId}
        creatorId={creatorId}
        refetch={refetch}
        currency={currency}
      />
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
  creatorId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
}
