/* eslint-disable react/display-name */
import React from 'react'
import InvitedGuests from './Components/InvitedGuests';

const GuestInvitationRoutes = [
  {
    routeProps: {
      path: '/invite/:id?/:logs?',
      component: () => <h4>Invite me</h4>,
    },
    name: 'Request Details',
    featureName: 'LogBook',
    accessibleBy: ['admin'],
  },
  {
    routeProps: {
      path: '/guests',
      component: InvitedGuests,
    },
    name: 'Visit Request',
    featureName: 'LogBook',
    accessibleBy: ['admin'],
  },
];

export default GuestInvitationRoutes;
