/* eslint-disable react/prop-types */
import React from 'react'
import { FullScreenDialog } from '../Dialog'

export default function PaymentReceipt({ paymentData, open, handleClose, comName, comImage }){
  return (
    <>
      {console.log(paymentData)}
      <FullScreenDialog open={open} handleClose={handleClose} title='Payment Receipt'>
        {comImage}
        {comName}
      </FullScreenDialog>
    </>
  )
}