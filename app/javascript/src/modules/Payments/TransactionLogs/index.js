import React from 'react';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import PaymentForm from './Components/PaymentForm';
import TransactionLogs from './Components/TransactionLogs';

const paymentPermission = ['can_make_payment', 'can_see_menu_item'];

const currentModule = 'transaction';

export function RenderPayment() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={paymentPermission}>
      <PaymentForm />
    </AccessCheck>
  );
}

export function RenderTransactionLogs() {
  return (
    <AccessCheck module='transaction_history' allowedPermissions={['can_see_menu_item']}>
      <TransactionLogs />
    </AccessCheck>
  );
}

const TransactionRoutes = [
  {
    routeProps: {
      path: '/payments/pay',
      component: RenderPayment,
      exact: true
    },
    name: t => t('common:misc.make_a_payment'),
    featureName: 'Transactions',
    moduleName: currentModule,
    accessibleBy: []
  },
  {
    routeProps: {
      path: '/transaction_logs',
      component: RenderTransactionLogs,
      exact: true
    },
    name: t => t('common:misc.history'),
    featureName: 'Transactions',
    moduleName: currentModule,
    accessibleBy: []
  }
];

export default {
  routeProps: {
    path: '',
    component: <span />
  },
  styleProps: {
    icon: <CreditCardIcon />
  },
  accessibleBy: [],
  moduleName: 'transaction',
  name: t => t('common:menu.transaction_plural'),
  featureName: 'Transactions',
  subRoutes: TransactionRoutes,
  subMenu: TransactionRoutes
};
