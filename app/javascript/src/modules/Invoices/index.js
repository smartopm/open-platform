import Payments from '../Payments/Components/Payments';

export default {
  routeProps: {
    path: '/payments', // dont specify the tab here because react-router needs to register the /payments path
    component: Payments
  },
  accessibleBy: ['admin'],
  name: 'Invoices'
};
