import React from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import LogBook from './Components/LogBook';
import GuestsValidateRoutes from './GuestVerification';
import AccessCheck from '../Permissions/Components/AccessCheck';
import GuestInvitationRoutes from './GuestInvitation';

const logBookPermissions = ['can_access_logbook'];

const gateAccessPermissions = ['can_see_menu_item'];

const currentModule = 'entry_request'

function GateAccessIcon() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={gateAccessPermissions}>
      <LogBook />
    </AccessCheck>
  )
}

function RenderLogBook() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={logBookPermissions}>
      <LogBook />
    </AccessCheck>
  )
}

const LogBooks = {
  routeProps: {
    path: '/logbook',
    component: RenderLogBook,
    exact: true,
  },
  styleProps: {
    icon: <MenuBookIcon />,
  },
  name: (t) => t('misc.log_book'),
  featureName: 'LogBook',
  accessibleBy: [],
  moduleName: currentModule,
  subRoutes: [...GuestsValidateRoutes],
};

export default {
  routeProps: {
    path: '/logbook',
    component: GateAccessIcon,
    exact: true
  },
  styleProps: {
    icon: <MenuBookIcon />,
    className: 'logbook-menu-item'
  },
  name: (t) => t('misc.log_book'),
  featureName: 'LogBook',
  moduleName: 'gate_access',
  accessibleBy: [],
  subMenu: [LogBooks, GuestInvitationRoutes],
};
