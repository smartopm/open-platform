// These are exportable routes to clean up the route file
import UserShow from '../../containers/UserShow';
import UserEdit from '../../containers/UserEdit';
import UserLogs from '../../containers/AllLogs/UserLogs';
import IdPrintPage from '../../containers/IdPrint';

// name in here is only used as key in routes, make sure it is unique

const routes = [
  {
    routeProps: {
      path: '/user/:id/:tab?/:tm?/:dg?',
      component: UserShow
    },
    accessibleBy: ['admin', 'client', 'resident', 'security_guard'],
    name: 'user_info'
  },
  {
    routeProps: {
      path: '/user/:id/logs',
      component: UserLogs
    },
    accessibleBy: ['admin'],
    name: 'user_logs'
  },
  {
    routeProps: {
      path: '/user/:id/edit',
      component: UserEdit
    },
    accessibleBy: ['admin', 'client', 'resident'],
    name: 'user_edit'
  },
  {
    routeProps: {
      path: '/print/:id/',
      component: IdPrintPage
    },
    accessibleBy: ['admin', 'client', 'resident'],
    name: 'print_id'
  }
];

export default routes;
