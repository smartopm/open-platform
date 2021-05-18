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
  name: t => t('menu.my_payments'),
  enabled: enabled => !!enabled,
  accessibleBy: ['client', 'resident'],
};
