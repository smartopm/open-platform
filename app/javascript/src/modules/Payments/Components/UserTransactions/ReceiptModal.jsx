import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { DetailsDialog } from '../../../../components/Dialog'
import PaymentReceipt from './PaymentReceipt'

export default function ReceiptModal({ open, handleClose, paymentData, currencyData }){
  const classes = useStyles();
  const [paymentReceipt, setPaymentReceipt] = useState(false)

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