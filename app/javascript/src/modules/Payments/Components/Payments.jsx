import React, { useContext } from 'react';
import TabbedPayments from './TabbedPayments';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';

export default function Payments() {
  const authState = useContext(AuthStateContext);
  return (
    <>
      <TabbedPayments authState={authState} />
    </>
  );
}
