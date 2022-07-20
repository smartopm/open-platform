import React from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogBook from './Components/LogBook';
import GuestsValidateRoutes from './GuestVerification';
import AccessCheck from '../Permissions/Components/AccessCheck';
import InvitationsRoutes from './Invitations';
import GuardPost from './Components/VisitView'

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

function RenderGuardPost() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={logBookPermissions}>
      <GuardPost />
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
  name: (t) => t('misc.logs'),
  featureName: 'LogBook',
  accessibleBy: [],
  moduleName: currentModule,
  subRoutes: [...GuestsValidateRoutes],
};

const GuardPosts = {
  routeProps: {
    path: '/guard_post',
    component: RenderGuardPost,
    exact: true,
  },
  styleProps: {
    icon: <MenuBookIcon />,
  },
  name: (t) => t('menu.guard_post'),
  featureName: 'LogBook',
  accessibleBy: [],
  moduleName: currentModule,
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
  name: (t) => t('misc.access'),
  featureName: 'LogBook',
  moduleName: 'gate_access',
  accessibleBy: [],
  subMenu: [LogBooks, GuardPosts, InvitationsRoutes],
};
