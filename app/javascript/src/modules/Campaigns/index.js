import Campaigns from '../../containers/Campaigns/Campaigns';

export default {
  routeProps: {
    path: '/campaigns',
    component: Campaigns
  },
  styleProps: {},
  name: t => t('misc.campaigns'),
  enabled: enabled => !!enabled,
  featureName: 'Campaigns',
  accessibleBy: ['admin']
};
