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
// import React from 'react';

// import UserShow from "../../containers/UserShow";
import UserEdit from '../../containers/UserEdit';
import UserLogs from '../../containers/AllLogs/UserLogs';
import IdPrintPage from '../../containers/IdPrint';

// TODO: find a way of dynamically getting these items maybe just an import like we are doing it with modules
// Nurudeen: IMO, I think it's good to have it here. Why do you think we should do it dynamically?
// This is fine for now.

// This file is being used in react_main.jsx to register these routes dynamically
// it is also being used in UserInformation to display the right menu

// Commented these out till we find a better way to avoid dependency cycle
// const paymentSubMenus = [
//   {
//     routeProps: {
//       path: '/user/:id?tab=Payments&payment_sub_tab=Invoices',
//       component: UserShow
//     },
//     name: 'Invoices',
//     accessibleBy: ['admin']
//   },
//   {
//     routeProps: {
//       path: '/user/:id?tab=Payments&payment_sub_tab=Transactions',
//       exact: true,
//       component: UserShow
//     },
//     name: 'Transactions',
//     accessibleBy: ['admin']
//   },
//   {
//     routeProps: {
//       path: '/user/:id?tab=Payments&payment_sub_tab=Plans',
//       component: UserShow
//     },
//     name: 'Plans',
//     accessibleBy: ['admin']
//   }
// ];

const UserMenus = [
  //   {
  //     routeProps: {
  //       path: '/user/:id',
  //       to: '/user/:id?tab=Communication',
  //       component: UserShow
  //     },
  //     name: 'Communication',
  //     accessibleBy: ['admin']
  //   },
  //   {
  //     routeProps: {
  //       path: '/user/:id',
  //       to: '/user/:id?tab=Notes',
  //       component: UserShow
  //     },
  //     name: 'Notes',
  //     accessibleBy: ['admin']
  //   },
  //   {
  //     routeProps: {
  //       path: '/user/:id',
  //       to: '/user/:id?tab=Plots',
  //       component: UserShow
  //     },
  //     name: 'Plots',
  //     accessibleBy: ['admin']
  //   },
  //   {
  //     routeProps: {
  //       path: '/user/:id',
  //       to: '/user/:id?tab=Forms',
  //       component: UserShow
  //     },
  //     name: 'Forms',
  //     accessibleBy: ['admin']
  //   },
  //   {
  //     routeProps: {
  //       path: '/user/:id',
  //       to: '/user/:id?tab=CustomerJourney',
  //       component: UserShow
  //     },
  //     name: 'Customer Journey',
  //     accessibleBy: ['admin']
  //   },
  //   {
  //     routeProps: {
  //       path: '/user/:id',
  //       to: '/user/:id?tab=Payments',
  //       component: UserShow
  //     },
  //     name: 'Payments',
  //     accessibleBy: ['admin'],
  //     subMenu: paymentSubMenus
  //   },
  //   {
  //     routeProps: {
  //       path: '/user/:id',
  //       to: '/user/:id?tab=MergeUser',
  //       component: UserShow
  //     },
  //     name: 'Merge User',
  //     accessibleBy: ['admin']
  //   },
  {
    routeProps: {
      // path registers in routes
      path: '/user/:id/logs',
      //   to is what a user goes to, the :id gets replaced by the actual id
      to: '/user/:id/logs',
      component: UserLogs
    },
    name: 'User Logs',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/user/:id/edit',
      to: '/user/:id/edit',
      component: UserEdit
    },
    name: 'Edit',
    accessibleBy: ['admin']
  },
  {
    routeProps: {
      path: '/print/:id/',
      to: '/print/:id/',
      component: IdPrintPage
    },
    name: 'Print ID',
    accessibleBy: ['admin']
  }
];

export default UserMenus;
