// These are exportable routes to clean up the route file
// to: '/user/id:',
// to: '/messages/:id',
// to: '/plots/id:'
import UserShow from '../../containers/UserShow';
import UserEdit from '../../containers/UserEdit';
import UserLogs from '../../containers/AllLogs/UserLogs';
import IdPrintPage from '../../containers/IdPrint';

const routes = [
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id/logs',
      component: UserLogs
    },
    name: 'User Logs',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id/edit',
      component: UserEdit
    },
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/print/:id/',
      component: IdPrintPage
    },
    accessibleBy: ['admin']
  }
];

export default routes;
