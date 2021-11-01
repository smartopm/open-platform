import GuestSearch from './Components/GuestSearch';
import InvitedGuests from './Components/InvitedGuests';

const GuestInvitationRoutes = [
  {
    routeProps: {
      path: '/logbook/guests/invite',
      component: GuestSearch,
    },
    name: 'Request Details',
    featureName: 'LogBook',
    accessibleBy: ['admin'],
  },
  {
    routeProps: {
      path: '/logbook/guests',
      component: InvitedGuests,
    },
    name: 'Visit Request',
    featureName: 'LogBook',
    accessibleBy: ['admin'],
  },
];

export default GuestInvitationRoutes;
