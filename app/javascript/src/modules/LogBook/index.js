import React from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EntryLogs from './Components/EntryLogs';
// logbook submodules
import GuestsList from './GuestList';
import GuestsValidateRoutes from './GuestVerification';
import AccessCheck from '../Permissions/Components/AccessCheck';

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
    className: 'logbook-menu-item'
  },
  name: (t) => t('misc.log_book'),
  featureName: 'LogBook',
  accessibleBy: [],
  moduleName: currentModule,
  subRoutes: [...GuestsValidateRoutes],
};

export default {
  routeProps: {
    path: '/entry_logs',
    component: GateAccessIcon,
  },
  styleProps: {
    icon: <MenuBookIcon />,
    className: 'logbook-parent-menu-item'
  },
  name: (t) => t('misc.log_book'),
  featureName: 'LogBook',
  moduleName: 'gate_access',
  accessibleBy: [],
  subMenu: [LogBooks, GuestsList],
};
