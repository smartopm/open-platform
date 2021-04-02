// These are exportable routes to clean up the route file
// to: '/user/id:',
// to: '/messages/:id',
// to: '/plots/id:'
import UserShow from '../../containers/UserShow';

// this file is currently not being used

const paymentSubMenus = [
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    name: 'Invoices',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id',
      exact: true,
      component: UserShow
    },
    name: 'Transactions',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    name: 'Plans',
    accessibleBy: ['admin']
  }
];

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
      path: '/user/:id',
      component: UserShow
    },
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    accessibleBy: ['admin'],
    subMenu: paymentSubMenus
  },
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    accessibleBy: ['admin']
  }
];

export default routes;
