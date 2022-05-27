import React from 'react'
import AccessCheck from '../../Permissions/Components/AccessCheck';
import PaymentForm from './Components/PaymentForm';

const paymentPermission = ['can_access_all_payments'];

const currentModule = 'plan_payment'

export default function RenderPayment() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={paymentPermission}>
      <PaymentForm />
    </AccessCheck>
  )
}
