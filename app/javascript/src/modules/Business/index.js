import Businesses from '../../containers/Businesses/Businesses';

export default {
  routeProps: {
    path: '/business',
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
