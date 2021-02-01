import React, { useContext } from 'react';
import Nav from '../../components/Nav';
// import PaymentList from '../../components/Payments/PaymentList';
import TabbedPayments from '../../components/Payments/TabbedPayments';
import { Context as AuthStateContext } from '../Provider/AuthStateProvider';

export default function Payments() {
  const authState = useContext(AuthStateContext);
  return (
    <>
      <Nav navName="Payments" backTo="/" menuButton="back" />
      {/* <PaymentList authState={authState} /> */}
      <TabbedPayments authState={authState} />
    </>
  );
}
