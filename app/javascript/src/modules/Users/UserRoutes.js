// These are exportable routes to clean up the route file
import UserShow from '../../containers/UserShow';
import UserEdit from '../../containers/UserEdit';
import UserLogs from '../../containers/AllLogs/UserLogs';
import IdPrintPage from '../../containers/IdPrint';

// name in here is only used as key in routes, make sure it is unique

const routes = [
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    accessibleBy: ['admin'],
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
    accessibleBy: ['admin'],
    name: 'user_edit'
  },
  {
    routeProps: {
      path: '/print/:id/',
      component: IdPrintPage
    },
    accessibleBy: ['admin'],
    name: 'print_id'
  }
];

export default routes;
