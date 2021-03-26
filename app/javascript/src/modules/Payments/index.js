import React from 'react';
import PaymentIcon from '@material-ui/icons/Payment';
import Invoices from '../Invoices';
import Transactions from '../Transactions';

const PaymentsPlaceHolder = () => <div>Payments Module</div>;

export default {
  routeProps: {
    path: '',
    component: PaymentsPlaceHolder
  },
  styleProps: {
    icon: <PaymentIcon />
  },
  name: 'Payments',
  accessibleBy: ['admin'],
  subMenu: [Invoices, Transactions]
};
