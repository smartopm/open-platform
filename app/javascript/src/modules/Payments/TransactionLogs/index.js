import React from 'react';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import PaymentForm from './Components/PaymentForm';

const paymentPermission = ['can_make_payment', 'can_see_menu_item'];

const currentModule = 'transaction';

function RenderPayment() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={paymentPermission}>
      <PaymentForm />
    </AccessCheck>
  );
}

export default {
  routeProps: {
    path: '/payments/pay',
    component: RenderPayment
  },
  styleProps: {
    icon: <CreditCardIcon />
  },
  name: t => t('common:misc.make_a_payment'),
  featureName: 'Transactions',
  moduleName: currentModule,
  accessibleBy: []
};
