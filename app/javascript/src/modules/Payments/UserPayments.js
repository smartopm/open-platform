import React from 'react';
import PaymentIcon from '@mui/icons-material/Payment';

export default {
  routeProps: {
    path: '/mypayments',
    component: <span />
  },
  styleProps: {
    icon: <PaymentIcon />
  },
  name: t => t('menu.my_payments'),
  featureName: 'User Payment',
  accessibleBy: ['client', 'resident']
};
