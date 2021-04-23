import Discussions from '../../containers/Discussions/Discussions';

export default {
  routeProps: {
    path: '/discussions',
    exact: true,
    component: Discussions
  },
  name: 'Discussions',
  accessibleBy: [
    'admin',
    'client',
    'prospective_client',
    'contractor',
    'resident',
  ]
};
