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

function formatPaymentMenu(translate) {
  return [
    {
      routeProps: {
        path: '/user/:id?tab=Payments&payment_sub_tab=Invoices',
        component: <span />
      },
      name: translate('common:menu:invoice', { count: 0 }),
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/user/:id?tab=Payments&payment_sub_tab=Transactions',
        exact: true,
        component: <span />
      },
      name: translate('common:menu:transaction', { count: 0 }),
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/user/:id?tab=Payments&payment_sub_tab=Plans',
        component: <span />
      },
      name: translate('common:menu:plan', { count: 0 }),
      accessibleBy: ['admin']
    }
  ];
}

export default function formatUserMenu(translate) {
  return [
    {
      routeProps: {
        path: '/user/:id?tab=Communication',
        component: <span />
      },
      name: translate('common:menu:communication'),
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/user/:id?tab=Notes',
        component: <span />
      },
      name: translate('common:menu:note', { count: 0 }),
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/user/:id?tab=Plots',
        component: <span />
      },
      name: translate('common:menu:plot', { count: 0 }),
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/user/:id?tab=Forms',
        component: <span />
      },
      name: translate('common:menu:form', { count: 0 }),
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/user/:id?tab=CustomerJourney',
        component: <span />
      },
      name: translate('common:menu:customer_journey'),
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/user/:id?tab=Payments',
        component: <span />
      },
      name: translate('common:menu:payment', { count: 0 }),
      accessibleBy: ['admin'],
      subMenu: formatPaymentMenu(translate)
    },
    {
      routeProps: {
        path: '/user/:id?tab=MergeUser',
        component: <span />
      },
      name: translate('common:menu:merge_user'),
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/user/:id/logs',
        component: <span />
      },
      name: translate('common:menu:user_logs'),
      accessibleBy: ['admin', 'security_guard']
    },
    {
      routeProps: {
        path: '/user/:id/edit',
        component: <span />
      },
      name: translate('common:menu:user_edit'),
      accessibleBy: allUserTypes
    },
    {
      routeProps: {
        path: '/print/:id/',
        component: <span />
      },
      name: translate('common:menu:print_id'),
      accessibleBy: allUserTypes
    },
    {
      routeProps: {
        path: '/message/:id/',
        component: <span />
      },
      name: translate('common:menu:message_support'),
      accessibleBy: allUserTypes
    },
    {
      routeProps: {
        path: '/message/:id/',
        component: <span />
      },
      name: translate('common:menu:send_sms'),
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/user/:id/otp',
        component: <span />
      },
      name: translate('common:menu:send_otp'),
      accessibleBy: ['admin']
    }
  ];
}
