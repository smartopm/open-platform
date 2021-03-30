import React from 'react';
import PaymentIcon from '@material-ui/icons/Payment';

export default {
  routeProps: {
    path: '/mypayments',
    component: <span />
  },
  styleProps: {
    icon: <PaymentIcon />
  },
  accessibleBy: ['client', 'resident'],
  name: 'My Payments'
};
