import React from 'react';
import PaymentIcon from '@material-ui/icons/Payment';
import Payments from './Components/Payments';

export default {
  routeProps: {
    path: '/payments',
    component: Payments
  },
  styleProps: {
    icon: <PaymentIcon />
  },
  name: 'Payments'
};
