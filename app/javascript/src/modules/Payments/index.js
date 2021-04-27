import React from 'react';
import PaymentIcon from '@material-ui/icons/Payment';
import Invoices from '../Invoices';
import Transactions from '../Transactions';
import PaymentSummary from './PaymentSummary'

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

export { PaymentSummary }