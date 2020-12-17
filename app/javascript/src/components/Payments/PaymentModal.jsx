import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { CustomizedDialogs } from '../Dialog'

export default function PaymentModal({ open, handleModalClose, invoiceData }){
  const classes = useStyles();
  const [inputValue, setInputValue] = useState({})

  function handleSubmit() {
    console.log('submit')
  }
  useEffect(() => {
    setInputValue({amount: invoiceData?.amount})
  }, [open])

  return(
    <>
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
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                "data-testid": "amount"
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
          </TextField>
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

PaymentModal.propTypes = {
  invoiceData: PropTypes.shape({
    amount: PropTypes.string,
    landParcel: PropTypes.shape({
      parcelNumber: PropTypes.string
    })
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
}