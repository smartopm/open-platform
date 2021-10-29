import React from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EntryLogs from './Components/EntryLogs';
// logbook submodules
import GuestsList from './GuestList';
import GuestsValidateRoutes from './GuestVerification';
import AccessCheck from '../Permissions/Components/AccessCheck';
import GuestInvitationRoutes from './GuestInvitation';

const logBookPermissions = ['can_access_logbook'];

const gateAccessPermissions = ['can_see_menu_item'];

const currentModule = 'entry_request'

function GateAccessIcon() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={gateAccessPermissions}>
      <EntryLogs />
    </AccessCheck>
)
}

function RenderLogBook() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={logBookPermissions}>
      <EntryLogs />
    </AccessCheck>
)
}

const LogBooks = {
  routeProps: {
    path: '/entry_logs',
    component: RenderLogBook
  },
  styleProps: {
    icon: <MenuBookIcon />,
  },
  name: (t) => t('misc.log_book'),
  featureName: 'LogBook',
  accessibleBy: [],
  moduleName: currentModule,
  subRoutes: [...GuestsValidateRoutes, ...GuestInvitationRoutes],
};

export default {
  routeProps: {
    path: '/entry_logs',
    component: GateAccessIcon,
  },
  styleProps: {
    icon: <MenuBookIcon />,
  },
  name: (t) => t('misc.log_book'),
  featureName: 'LogBook',
  moduleName: 'gate_access',
  accessibleBy: [],
  subMenu: [LogBooks, GuestsList],
};
