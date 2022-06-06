import AllMessages from '../../containers/Messages/AllMessages';

export default {
  routeProps: {
    path: '/messages',
    component: AllMessages
  },
  name: t => t('menu.message', { count: 0 }),
  featureName: 'Messages',
  accessibleBy: ['admin', 'marketing_admin']
};
