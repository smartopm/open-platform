import React from 'react'
import CreditCardIcon from '@material-ui/icons/CreditCard';
import Payments from '../Payments/Components/Payments';

export default {
  routeProps: {
    path: '/payments',
    component: Payments
  },
  styleProps: {
    icon: <CreditCardIcon />
  },
  accessibleBy: ['admin'],
  name: t => t('menu.payment', { count: 0 }),
  featureName: 'Payments',
};
