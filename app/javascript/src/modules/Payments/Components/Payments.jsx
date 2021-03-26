import React, { useContext } from 'react';
import TabbedPayments from './TabbedPayments';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import AdminWrapper from '../../../shared/AdminWrapper';

export default function Payments() {
  const authState = useContext(AuthStateContext);
  return (
    <AdminWrapper>
      <TabbedPayments authState={authState} />
    </AdminWrapper>
  );
}
