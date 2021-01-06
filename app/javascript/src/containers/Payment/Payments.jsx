import React, { useContext } from 'react'
import Nav from '../../components/Nav'
import PaymentList from '../../components/Payments/PaymentList'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider'

export default function Payments(){
  const authState = useContext(AuthStateContext)
  return (
    <>
      <Nav navName="Payments" backTo="/" menuButton="back" />
      <PaymentList authState={authState} />
    </>
  )
}
