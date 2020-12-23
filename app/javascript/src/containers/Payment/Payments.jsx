import React from 'react'
import Nav from '../../components/Nav'
import PaymentList from '../../components/Payments/PaymentList'

export default function Payments(){
    return (
      <>
        <Nav navName="Payments" backTo="/" menuButton="back" />
        <PaymentList />
      </>
    )
}