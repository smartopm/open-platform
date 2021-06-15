import React from 'react'
import CreditCardIcon from '@material-ui/icons/CreditCard';
import PaymentSummary from './PaymentSummary'
import Payments from "./Components/Payments";

export default {
  routeProps: {
    path: '/payments',
    component: Payments,
  },
  styleProps: {
    icon: <CreditCardIcon />
  },
  accessibleBy: ['admin'],
  name: t => t('menu.payment', { count: 0 }),
  featureName: 'Payments'
};

export { PaymentSummary }