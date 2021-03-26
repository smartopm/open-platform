import AllMessages from '../../containers/Messages/AllMessages';

export default {
  routeProps: {
    path: '/messages',
    component: AllMessages
  },
  name: 'Messages',
  accessibleBy: ['admin']
};
