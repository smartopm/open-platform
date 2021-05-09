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

const paymentMenu = [
  {
    routeProps: {
      path: '/user/:id?tab=Payments&payment_sub_tab=Invoices',
      component: <span />
    },
    name: t => t('menu.invoice', { count: 0 }),
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Payments&payment_sub_tab=Transactions',
      exact: true,
      component: <span />
    },
    name: t => t('menu.transaction', { count: 0 }),
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Payments&payment_sub_tab=Plans',
      component: <span />
    },
    name: t => t('menu.plan', { count: 0 }),
    accessibleBy: ['admin']
  }
];

const userMenus = [
  {
    routeProps: {
      path: '/user/:id?tab=Communication',
      component: <span />
    },
    name: t => t('menu.communication'),
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Notes',
      component: <span />
    },
    name: t => t('menu.note', { count: 0 }),
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Plots',
      component: <span />
    },
    name: t => t('menu.plot', { count: 0 }),
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Forms',
      component: <span />
    },
    name: t => t('menu.form', { count: 0 }),
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=CustomerJourney',
      component: <span />
    },
    name: t => t('menu.customer_journey'),
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Payments',
      component: <span />
    },
    name: t => t('menu.payment', { count: 0 }),
    accessibleBy: ['admin'],
    subMenu: paymentMenu
  },
  {
    routeProps: {
      path: '/user/:id?tab=MergeUser',
      component: <span />
    },
    name: t => t('menu.merge_user'),
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id/logs',
      component: <span />
    },
    name: t => t('menu.user_logs'),
    accessibleBy: ['admin', 'security_guard']
  },
  {
    routeProps: {
      path: '/user/:id/edit',
      component: <span />
    },
    name: t => t('menu.user_edit'),
    accessibleBy: allUserTypes
  },
  {
    routeProps: {
      path: '/print/:id/',
      component: <span />
    },
    name: t => t('menu.print_id'),
    accessibleBy: allUserTypes
  },
  {
    routeProps: {
      path: '/message/:id/',
      component: <span />
    },
    name: t => t('menu.message_support'),
    accessibleBy: allUserTypes
  },
  {
    routeProps: {
      path: '/message/:id/',
      component: <span />
    },
    name: t => t('menu.send_sms'),
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id/otp',
      component: <span />
    },
    name: t => t('menu.send_otp'),
    accessibleBy: ['admin']
  }
];

export default userMenus