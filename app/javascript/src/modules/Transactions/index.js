import Payments from '../Payments/Components/Payments';

export default {
  routeProps: {
    path: '/payments?tab=payment',
    component: Payments
  },
  accessibleBy: ['admin'],
  name: t => t('menu.transaction', { count: 0 }),
  enabled: enabled => !!enabled,
  featureName: 'Transactions',
};
