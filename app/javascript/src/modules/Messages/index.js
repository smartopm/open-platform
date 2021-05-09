import AllMessages from '../../containers/Messages/AllMessages';

export default {
  routeProps: {
    path: '/messages',
    component: AllMessages
  },
  name: t => t('menu.message', { count: 0 }),
  accessibleBy: ['admin']
};
