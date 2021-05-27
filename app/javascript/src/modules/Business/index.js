import Businesses from './Components/Businesses';

export default {
  routeProps: {
    path: '/businesses',
    component: Businesses
  },
  name: t => t('misc.business'),
  featureName: 'Business',
  accessibleBy: [
    'admin',
    'client',
    'prospective_client',
    'contractor',
    'resident',
  ]
};
