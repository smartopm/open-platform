import React from 'react'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentSummary from './PaymentSummary'
import Payments from "./Components/Payments";
import AccessCheck from '../Permissions/Components/AccessCheck';
import  RenderPayment from './RavePayments';

const paymentsPermissions = ['can_access_all_payments'];
const currentModule = 'plan_payment';

function RenderPaymentsList() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={paymentsPermissions}>
      <Payments />
    </AccessCheck>
  )
}


const RavePayment = [
  {
    routeProps: {
      path: '/payments',
      component: RenderPaymentsList,
      exact: true,
    },
    styleProps: {
      icon: <CreditCardIcon />,
    },
    name: t => t('menu.payment', { count: 1 }),
    featureName: 'Payments',
    accessibleBy: [],
    moduleName: currentModule,
  },
  {
    routeProps: {
      path: '/payments/rave',
      component: RenderPayment,
      exact: true,
    },
    name: t => t('common:misc.make_a_payment'),
    featureName: 'Payments',
    moduleName: currentModule,
    accessibleBy: [],
  },
]


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
  featureName: 'Payments',
  subRoutes: RavePayment,
  subMenu: RavePayment,
};

export { PaymentSummary }