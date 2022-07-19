import React from 'react';
import HailIcon from '@mui/icons-material/Hail';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import GuestSearch from './Components/GuestSearch';
import InvitedGuests from './Components/InvitedGuests';

const guestListPermissions = ['can_access_guest_list'];
const currentModule = 'entry_request'

function RenderGuestList() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={guestListPermissions}>
      <InvitedGuests />
    </AccessCheck>
  )
}

function RenderGuestSearch() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={guestListPermissions}>
      <GuestSearch />
    </AccessCheck>
  )
}

const GuestInvitationRoutes = {
  routeProps: {
    path: '/logbook/guests',
    component: RenderGuestList
  },
  styleProps: {
    icon: <HailIcon />,
    className: 'guest-list-sub-menu-item',
  },
  name: (t) => t('menu.my_guests'),
  featureName: 'Guest List',
  moduleName: 'guest_list',
  accessibleBy: [],
  hideFromMenu: ['admin'],
  subRoutes: [
    {
      routeProps: {
        path: '/logbook/guests/invite/:guestId?',
        component: RenderGuestSearch,
        exact: true
      },
      name: 'Visit Request',
      featureName: 'LogBook',
      accessibleBy: [],
    }
  ],
}

export default GuestInvitationRoutes;
