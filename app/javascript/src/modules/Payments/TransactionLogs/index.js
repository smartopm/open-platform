import React from 'react'
import AccessCheck from '../../Permissions/Components/AccessCheck';
import PaymentForm from './Components/PaymentForm';

// TODO: Update this permission
const paymentPermission = ['can_make_payment', 'can_see_menu_item'];

const currentModule = 'transaction'

export default function RenderPayment() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={paymentPermission}>
      <PaymentForm />
    </AccessCheck>
  )
}
