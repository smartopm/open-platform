/* eslint-disable react/prop-types */
import React from 'react'
import { FullScreenDialog } from '../Dialog'
import ImageAuth from '../../shared/ImageAuth';
import Logo from '../../../../assets/images/logo.png'

export default function PaymentReceipt({ paymentData, open, handleClose, comName, comImage, token }){
  return (
    <>
      <FullScreenDialog open={open} handleClose={handleClose} title='Payment Receipt'>
        <ImageAuth
          imageLink={Logo}
          token={token}
          style={{height: '10px', width: '20px'}}
        />
        {comImage}
        {comName}
      </FullScreenDialog>
    </>
  )
}