import React from 'react'
import GuestValidate from './Containers/GuestValidate';
import AccessCheck from '../../Permissions/Components/AccessCheck';

const guestValidatePermissions = ['can_go_through_guest_verification'];
const guestCreatePermissions = ['can_access_guest_list']; 

const currentModule = 'entry_request'

function RenderGuestValidate() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={guestValidatePermissions}>
      <GuestValidate />
    </AccessCheck>
  )
}

function RenderGuestCreate() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={guestCreatePermissions}>
      <GuestValidate />
    </AccessCheck>
  )
}

const GuestsValidatorRoutes = [
  {
    routeProps: {
      path: '/request/:id?/:logs?',
      component: RenderGuestValidate,
    },
    name: 'Request Details',
    featureName: 'LogBook',
    accessibleBy: [],
  },
  {
    routeProps: {
      path: '/visit_request',
      component: RenderGuestCreate,
    },
    name: 'Visit Request',
    featureName: 'LogBook',
    accessibleBy: [],
  },
];

export default GuestsValidatorRoutes;
