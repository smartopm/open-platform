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
import { allUserTypes } from '../../utils/constants';

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

const UserMenus = [
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
        path: '/user/:id?tab=MergeUser',
        component: <span />
      },
      name: 'Merge User',
      accessibleBy: ['admin']
    },
  {
    routeProps: {
      path: '/user/:id/logs',
      component: <span />
    },
    name: 'User Logs',
    accessibleBy: ['admin', 'security_guard']
  },
  {
    routeProps: {
      path: '/user/:id/edit',
      component: <span />
    },
    name: 'Edit',
    accessibleBy: allUserTypes
  },
  {
    routeProps: {
      path: '/print/:id/',
      component: <span />
    },
    name: 'Print ID',
    accessibleBy: allUserTypes
  },
  {
    routeProps: {
      path: '/message/:id/',
      component: <span />
    },
    name: 'Message Support',
    accessibleBy: allUserTypes
  },
  {
    routeProps: {
      path: '/message/:id/',
      component: <span />
    },
    name: 'Send SMS',
    accessibleBy: ['admin',]
  },
  {
    routeProps: {
      path: '/user/:id/otp',
      component: <span />
    },
    name: 'Send OTP',
    accessibleBy: ['admin']
  }
];

export default UserMenus;
