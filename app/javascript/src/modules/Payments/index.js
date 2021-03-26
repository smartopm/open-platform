import React from 'react';
import PaymentIcon from '@material-ui/icons/Payment';
import Payments from './Components/Payments';

// this is a main module that contains other submodules
const subMenus = [
  {
    routeProps: {
      path: '/payments?tab=payment',
      component: Payments
    },
    accessibleBy: ['admin'],
    name: 'Transactions'
  },
  {
    routeProps: {
      path: '/payments?tab=invoice',
      component: Payments
    },
    accessibleBy: ['admin'],
    name: 'Invoices'
  }
];

export default {
  routeProps: {
    path: '/payments',
    component: Payments
  },
  styleProps: {
    icon: <PaymentIcon />
  },
  name: 'Payments',
  accessibleBy: ['admin'],
  subMenu: subMenus
};
