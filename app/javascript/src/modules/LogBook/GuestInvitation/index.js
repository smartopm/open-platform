import React from 'react';
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
    icon: null,
    className: 'guest-list-sub-menu-item'
  },
  name: (t) => t('menu.my_guest'),
  featureName: 'Guest List',
  moduleName: 'guest_list',
  accessibleBy: [],
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
