import React from 'react';
import PaymentIcon from '@material-ui/icons/Payment';
import Invoices from '../Invoices';
import Transactions from '../Transactions';

export default {
  routeProps: {
    path: '',
    component: <span />
  },
  styleProps: {
    icon: <PaymentIcon />
  },
  name: 'Payments',
  accessibleBy: ['admin'],
  subMenu: [Invoices, Transactions]
};
