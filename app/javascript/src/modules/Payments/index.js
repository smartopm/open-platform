import React from 'react'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentSummary from './PaymentSummary'
import Payments from "./Components/Payments";
import AccessCheck from '../Permissions/Components/AccessCheck';

const paymentsPermissions = ['can_access_all_payments'];
const currentModule = 'plan_payment';

function RenderPaymentsList() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={paymentsPermissions}>
      <Payments />
    </AccessCheck>
  )
}

export default {
  routeProps: {
    path: '/payments',
    component: RenderPaymentsList,
  },
  styleProps: {
    icon: <CreditCardIcon />
  },
  accessibleBy: [],
  moduleName: currentModule,
  name: t => t('menu.payment', { count: 0 }),
  featureName: 'Payments'
};

export { PaymentSummary }