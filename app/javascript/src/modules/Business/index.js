import Businesses from '../../containers/Businesses/Businesses';

export default {
  routeProps: {
    path: '/business',
    component: Businesses
  },
  name: 'Business',
  accessibleBy: [
    'admin',
    'client',
    'prospective_client',
    'contractor',
    'resident',
  ]
};
