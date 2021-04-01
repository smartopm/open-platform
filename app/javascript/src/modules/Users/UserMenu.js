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
import { Person } from '@material-ui/icons';

// TODO: find a way of dynamically getting these items maybe just an import like we are doing it with modules
const routes = [
  {
    routeProps: {
      path: '/user/:id?tab=Communication',
      component: <span />
    },
    styleProps: {
      icon: <Person />
    },
    name: 'Communication',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Notes',
      component: <span />
    },
    styleProps: {
      icon: <Person />
    },
    name: 'Notes',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Plots',
      component: <span />
    },
    styleProps: {
      icon: <Person />
    },
    name: 'Plots',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Forms',
      component: <span />
    },
    styleProps: {
      icon: <Person />
    },
    name: 'Forms',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=CustomerJourney',
      component: <span />
    },
    styleProps: {
      icon: <Person />
    },
    name: 'Customer Journey',
    accessibleBy: ['admin']
  },
];

export default routes;
