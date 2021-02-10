/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { DetailsDialog } from '../Dialog'
import PaymentReceipt from './PaymentReceipt'

export default function ReceiptModal({ open, handleClose, paymentData, comImage, comName }){
  const classes = useStyles();
  const [paymentReceipt, setPaymentReceipt] = useState(false)

  function handlePaymentReceipt() {
    setPaymentReceipt(true)
    handleClose()
  }

  function handleReceiptClose() {
    setPaymentReceipt(false)
  }
  return(
    <>
      <DetailsDialog
        title='Generate Receipt'
        open={open}
        handleClose={handleClose}
      >
        <div className={classes.buttons}>
          <Button variant='contained' color='primary' style={{marginRight: '15px'}} onClick={() => handlePaymentReceipt()}>Print Receipt</Button>
          <Button variant='outlined' color='secondary' style={{marginLeft: '15px'}} onClick={handleClose}>Continue</Button>
        </div>
      </DetailsDialog>
      <PaymentReceipt 
        paymentData={paymentData} 
        open={paymentReceipt} 
        handleClose={() => handleReceiptClose()}
        comImage={comImage} 
        comName={comName}
      />
    </>
  )
}

const useStyles = makeStyles({
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    margin: '30px 0'
  }
});