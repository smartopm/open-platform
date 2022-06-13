import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import { DetailsDialog } from '../../../../components/Dialog'
import PaymentReceipt from './PaymentReceipt'

export default function ReceiptModal({ open, handleClose, paymentData, currencyData }){
  const classes = useStyles();
  const [paymentReceipt, setPaymentReceipt] = useState(false)

  function handlePaymentReceipt() {
    setPaymentReceipt(true)
    handleClose()
  }

  return(
    <>
      <DetailsDialog
        title='Generate Receipt'
        open={open}
        handleClose={handleClose}
        noActionButton
      >
        <div className={classes.buttons}>
          <Button
            variant='contained'
            color='primary'
            style={{marginRight: '15px'}}
            onClick={() => handlePaymentReceipt()}
            data-testid='print'
          >
            Print Receipt
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            style={{marginLeft: '15px'}}
            onClick={handleClose}
            data-testid='continue'
          >
            Continue
          </Button>
        </div>
      </DetailsDialog>
      <PaymentReceipt
        paymentData={paymentData}
        open={paymentReceipt}
        handleClose={() => setPaymentReceipt(false)}
        currencyData={currencyData}
      />
    </>
  )
}

const useStyles = makeStyles({
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    margin: '30px'
  }
});

ReceiptModal.defaultProps = {
  paymentData: {},
 }
 ReceiptModal.propTypes = {
  paymentData: PropTypes.shape({
    source: PropTypes.string,
    amount: PropTypes.number,
    currentWalletBalance: PropTypes.number,
    bankName: PropTypes.string,
    chequeNumber: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string
    })
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
}