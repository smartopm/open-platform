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
import { checkAccessibilityForUserType as handler } from '../../utils/helpers'

const userMenus = [
  {
    routeProps: {
      path: '/user/:id?tab=Communication',
      component: <span />
    },
    name: t => t('menu.communication'),
    featureName: 'Messages',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Notes',
      component: <span />
    },
    name: t => t('menu.note', { count: 0 }),
    featureName: 'Tasks',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Plots',
      component: <span />
    },
    name: t => t('menu.plot', { count: 0 }),
    featureName: 'Properties',
    accessibleBy: ctx => handler({ userTypes: ['admin', 'client', 'resident'], ctx }),
  },
  {
    routeProps: {
      path: '/user/:id?tab=Forms',
      component: <span />
    },
    name: t => t('menu.form', { count: 0 }),
    featureName: 'Forms',
    accessibleBy: ctx => handler({ userTypes: ['admin', 'client', 'resident'], ctx }),
  },
  {
    routeProps: {
      path: '/user/:id?tab=CustomerJourney',
      component: <span />
    },
    name: t => t('menu.customer_journey'),
    featureName: 'Customer Journey',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id?tab=Plans',
      component: <span />
    },
    name: t => t('menu.payment', { count: 0 }),
    featureName: 'Payments',
    accessibleBy: ctx => handler({ userTypes: ['admin', 'client', 'resident'], ctx }),
  },
  {
    routeProps: {
      path: '/user/:id?type=MergeUser', // changed to remove console and jest errors 
      component: <span />
    },
    name: t => t('menu.merge_user'),
    featureName: 'Users',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id/logs',
      component: <span />
    },
    name: t => t('menu.user_logs'),
    featureName: 'LogBook',
    accessibleBy: ctx => handler({ userTypes: ['admin', 'security_guard'], ctx }),
  },
  {
    routeProps: {
      path: '/user/:id/edit',
      component: <span />
    },
    name: t => t('menu.user_edit'),
    featureName: 'Users',
    accessibleBy: ctx => handler({ userTypes: allUserTypes, ctx })
  },
  {
    routeProps: {
      path: '/print/:id/',
      component: <span />
    },
    name: t => t('menu.print_id'),
    featureName: 'Users',
    accessibleBy: allUserTypes
  },
  {
    routeProps: {
      path: '/message/:id/',
      component: <span />
    },
    name: t => t('menu.message_support'),
    featureName: 'Messages',
    accessibleBy: allUserTypes
  },
  {
    routeProps: {
      path: '/message/:id/',
      component: <span />
    },
    name: t => t('menu.send_sms'),
    featureName: 'Messages',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id/otp',
      component: <span />
    },
    name: t => t('menu.send_otp'),
    featureName: 'Users',
    accessibleBy: ['admin']
  }
];

export default userMenus