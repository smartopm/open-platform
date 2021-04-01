/**
 * Communication
 * Notes
 * Plots
 * Forms
 * Customer Journey
 * Payments
 *  Invoices
 *  Transactions
 *  Plans
 * Merge User
 * Send OTP
 * Print
 * Edit
 */
import React from 'react';

// TODO: find a way of dynamically getting these items maybe just an import like we are doing it with modules
// Nurudeen: IMO, I think it's good to have it here. Why do you think we should do it dynamically?

const paymentSubMenus = [
  {
    routeProps: {
      path: '/user/:id?tab=Payments&payment_sub_tab=Invoices',
      component: <span />
    },
    name: 'Invoices',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Payments&payment_sub_tab=Transactions',
      exact: true,
      component: <span />
    },
    name: 'Transactions',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Payments&payment_sub_tab=Plans',
      component: <span />
    },
    name: 'Plans',
    accessibleBy: ['admin']
  }
];

const routes = [
  {
    routeProps: {
      path: '/user/:id?tab=Communication',
      component: <span />
    },
    name: 'Communication',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Notes',
      component: <span />
    },
    name: 'Notes',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Plots',
      component: <span />
    },
    name: 'Plots',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Forms',
      component: <span />
    },
    name: 'Forms',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=CustomerJourney',
      component: <span />
    },
    name: 'Customer Journey',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Payments',
      component: <span />
    },
    name: 'Payments',
    accessibleBy: ['admin'],
    subMenu: paymentSubMenus
  },
  {
    routeProps: {
        // we can have a different param here
      path: '/user/:id?tab=MergeUser',
      component: <span />
    },
    name: 'Merge User',
    accessibleBy: ['admin'],
  }
];

export default routes;
