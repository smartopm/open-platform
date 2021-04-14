import Payments from '../Payments/Components/Payments';

export default {
  routeProps: {
    path: '/payments?tab=payment',
    component: Payments
  },
  accessibleBy: ['admin'],
  name: 'Transactions'
};