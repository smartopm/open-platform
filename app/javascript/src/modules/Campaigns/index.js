import Campaigns from '../../containers/Campaigns/Campaigns';

export default {
  routeProps: {
    path: '/campaigns',
    component: Campaigns
  },
  styleProps: {},
  name: t => t('misc.campaigns'),
  
  featureName: 'Campaigns',
  accessibleBy: ['admin']
};
