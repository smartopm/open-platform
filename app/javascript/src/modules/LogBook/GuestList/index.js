import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import RequestUpdate from '../Components/RequestUpdate';
import GuestList from './Components/GuestList';
import GuestUpdate from './containers/GuestUpdate';
import AccessCheck from '../../Permissions/Components/AccessCheck';


const guestListPermissions = ['can_access_guest_list'];
const guestListUpdatePermissions = ['can_access_guest_list'];
const guestListCreatePermissions = ['can_access_guest_list'];

const currentModule = 'entry_request'

function RenderGuestList() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={guestListPermissions}>
      <GuestList />
    </AccessCheck>
)
}


function RenderGuestUpdate() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={guestListUpdatePermissions}>
      <GuestUpdate />
    </AccessCheck>
)
}

function RenderGuestForm() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={guestListCreatePermissions}>
      <RequestUpdate />
    </AccessCheck>
)
}

// TODO: routes should be changed to _ instead of -
const GuestsList = {
  routeProps: {
    path: '/guest-list',
    component: RenderGuestList,
  },
  styleProps: {
    icon: <PeopleIcon />,
  },
  name: (t) => t('menu.guest_list'),
  featureName: 'Guest List',
  moduleName: 'guest_list',
  accessibleBy: [],

  subRoutes: [
    {
      routeProps: {
        path: '/guest-list/:guestListEntryId',
        exact: true,
        component: RenderGuestUpdate,
      },
      name: 'GuestListUpdate',
      accessibleBy: [],
    },
    {
      routeProps: {
        path: '/guest-list/new-guest-entry',
        exact: true,
        component: RenderGuestForm,
      },
      name: 'GuestListForm',
      accessibleBy: [],
    },
  ],
};

export default GuestsList;