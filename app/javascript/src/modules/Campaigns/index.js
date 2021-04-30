import Campaigns from '../../containers/Campaigns/Campaigns';

export default {
  routeProps: {
    path: '/campaigns',
    component: Campaigns
  },
  styleProps: {},
  name: 'Campaigns',
  accessibleBy: ['admin']
};
