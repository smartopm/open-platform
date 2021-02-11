import React, { useState } from 'react'
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
  status: 'pending',
  bankName: '',
  chequeNumber: '',
  transactionNumber: '',
}

export default function PaymentModal({ open, handleModalClose, userId, currency, refetch, depRefetch, walletRefetch }){
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
        userId,
        amount: parseFloat(inputValue.amount),
        source: inputValue.transactionType,
        status: inputValue.status,
        bankName: inputValue.bankName,
        chequeNumber: inputValue.chequeNumber,
        transactionNumber: inputValue.transactionNumber,
      }
    }).then(() => {
      setMessageAlert('Payment made successfully')
      setIsSuccessAlert(true)
      handleModalClose()
      refetch()
      depRefetch()
      walletRefetch()
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
            <MenuItem value='mobile_money'>Mobile Money</MenuItem>
            <MenuItem value='bank_transfer/cash_deposit'>Bank Transfer/Cash Deposit</MenuItem>
            <MenuItem value='bank_transfer/eft'>Bank Transfer/EFT</MenuItem>
            <MenuItem value='pos'>Point of Sale</MenuItem>
          </TextField>
          <TextField
            autoFocus
            margin="dense"
            id="transaction-number"
            label="Transaction Number"
            type='string'
            value={inputValue.transactionNumber}
            onChange={(event) => setInputValue({...inputValue, transactionNumber: event.target.value})}
          />
          {
            inputValue.transactionType === 'cheque/cashier_cheque' && (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="bank-name"
                  label="Bank Name"
                  type='string'
                  value={inputValue.bankName}
                  onChange={(event) => setInputValue({...inputValue, bankName: event.target.value})}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="cheque-number"
                  label="Cheque Number"
                  type='string'
                  value={inputValue.chequeNumber}
                  onChange={(event) => setInputValue({...inputValue, chequeNumber: event.target.value})}
                />
                <TextField
                  margin="dense"
                  id="payment-status"
                  inputProps={{ "data-testid": "payment-status" }}
                  label="Payment Status"
                  value={inputValue.status}
                  onChange={(event) => setInputValue({...inputValue, status: event.target.value})}
                  required
                  select
                >
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='settled'>Settled</MenuItem>
                </TextField>
              </>
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
    width: '500px'
  }
});

PaymentModal.defaultProps = {
  depRefetch: () => {},
  walletRefetch: () => {}
 }
PaymentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  depRefetch: PropTypes.func,
  walletRefetch: PropTypes.func,
  currency: PropTypes.string.isRequired
}
