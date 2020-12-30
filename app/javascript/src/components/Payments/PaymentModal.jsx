import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { CustomizedDialogs } from '../Dialog'
import { PaymentCreate } from '../../graphql/mutations'
import MessageAlert from "../MessageAlert"
import { formatError } from '../../utils/helpers'


const initialValues = {
  amount: '',
  transactionType: '',
  paymentStatus: 'pending',
  bankName: '',
  chequeNumber: '',
}

export default function PaymentModal({ open, handleModalClose, invoiceData, userId, creatorId, refetch, currency }){
  const classes = useStyles();
  const history = useHistory()
  const [inputValue, setInputValue] = useState(initialValues)
  const [createPayment] = useMutation(PaymentCreate)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    createPayment({
      variables: {
        userId: creatorId,
        invoiceId: invoiceData.id,
        amount: parseFloat(inputValue.amount),
        paymentType: inputValue.transactionType,
        paymentStatus: inputValue.paymentStatus || 'pending',
        bankName: inputValue.bankName,
        chequeNumber: inputValue.chequeNumber,
      }
    }).then(() => {
      setMessageAlert('Payment made successfully')
      setIsSuccessAlert(true)
      handleModalClose()
      refetch()
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

  useEffect(() => {
    setInputValue({amount: invoiceData?.amount})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return(
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
        dialogHeader='Make a Payment'
        handleBatchFilter={handleSubmit}
        subHeader={`You are about to make a payment $${invoiceData?.amount} for parcel number ${invoiceData?.landParcel.parcelNumber}`}
      >
        <div className={classes.invoiceForm}>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount"
            type='number'
            value={inputValue.amount}
            onChange={(event) => setInputValue({...inputValue, amount: event.target.value})}
            InputProps={{
            startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
                "data-testid": "amount",
                step: 0.01
              }}
            required
          />
          <TextField
            margin="dense"
            id="transaction-type"
            inputProps={{ "data-testid": "transaction-type" }}
            label="Transaction Type"
            value={inputValue.transactionType}
            onChange={(event) => setInputValue({...inputValue, transactionType: event.target.value})}
            required
            select
          >
            <MenuItem value='cash'>Cash</MenuItem>
            <MenuItem value='cheque/cashier_cheque'>Cheque/Cashier Cheque</MenuItem>
          </TextField>
          {
            inputValue.transactionType === 'cheque/cashier_cheque' && (
              <TextField
                autoFocus
                margin="dense"
                id="bank-name"
                label="Bank Name"
                type='string'
                value={inputValue.bankName}
                onChange={(event) => setInputValue({...inputValue, bankName: event.target.value})}
              />
            )
          }
          {
            inputValue.transactionType === 'cheque/cashier_cheque' && (
              <TextField
                autoFocus
                margin="dense"
                id="cheque-number"
                label="Cheque Number"
                type='string'
                value={inputValue.chequeNumber}
                onChange={(event) => setInputValue({...inputValue, chequeNumber: event.target.value})}
              />
            )
          }
          {
            inputValue.transactionType === 'cheque/cashier_cheque' && (
              <TextField
                margin="dense"
                id="payment-status"
                inputProps={{ "data-testid": "payment-status" }}
                label="Payment Status"
                value={inputValue.paymentStatus ? inputValue.paymentStatus : ""}
                onChange={(event) => setInputValue({...inputValue, paymentStatus: event.target.value})}
                select
              >
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='settled'>Settled</MenuItem>
              </TextField>
            )
          }
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

PaymentModal.defaultProps = {
  invoiceData: null
}
PaymentModal.propTypes = {
  invoiceData: PropTypes.shape({
    amount: PropTypes.number,
    id: PropTypes.string,
    landParcel: PropTypes.shape({
      parcelNumber: PropTypes.string
    })
  }),
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  creatorId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired
}
