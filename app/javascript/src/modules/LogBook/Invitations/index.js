import React from 'react';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import Invitations from './Components/InvitationList';

const guestListPermissions = ['can_access_guest_list'];
const currentModule = 'entry_request';

function RenderInvitations() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={guestListPermissions}>
      <Invitations />
    </AccessCheck>
  );
}

const InvitationsRoutes = {
  routeProps: {
    path: '/logbook/invitations',
    component: RenderInvitations,
  },
  styleProps: {
    icon: null,
    className: 'invitations-sub-menu-item',
  },
  name: t => t('menu.invitations'),
  featureName: 'LogBook',
  moduleName: currentModule,
  accessibleBy: [],
};

export default InvitationsRoutes;
