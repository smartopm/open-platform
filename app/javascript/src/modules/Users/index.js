import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Users from './Containers/Users';
import UserShow from './Containers/UserShow';
import AccessCheck from '../Permissions/Components/AccessCheck';
import MyMessages from '../Messages/MyMessages';
import MyForms from '../Forms/UserForms';
import GuestInvitationRoutes from '../LogBook/GuestInvitation';

const user = { module: 'user' };

const userPermissions = ['can_access_all_users'];
const profilePermissions = ['can_view_own_profile'];

export function RenderUsers() {
  return (
    <AccessCheck module={user.module} allowedPermissions={userPermissions}>
      <Users />
    </AccessCheck>
  );
}

function RenderUserProfile() {
  return (
    <AccessCheck module={user.module} allowedPermissions={profilePermissions}>
      <UserShow />
    </AccessCheck>
  );
}

// for nested links, I think these will likely be on the user
// we can have a to prop and substitute once we are on the right menu
// to: '/user/id:',
// to: '/messages/:id',
// to: '/plots/id:'
// users menu
// ==> for admin

export default {
  routeProps: {
    path: '/users',
    component: RenderUsers
  },
  styleProps: {
    icon: <PersonIcon />,
    className: 'users-menu-item'
  },
  name: t => t('misc.users'),
  moduleName: user.module,
  featureName: 'Users',
  accessibleBy: []
};

// temporarily export the user profile page here, these will be part of the core user module
// TODO: @olivier remove after merging the subroutes implementation
export const Profile = {
  routeProps: {
    path: '/myprofile',
    component: RenderUserProfile
  },
  styleProps: {
    icon: <AccountCircleIcon />,
    className: 'my-profile-menu-item'
  },
  name: t => t('menu.my_profile'),
  featureName: 'Profile',
  moduleName: 'profile',
  accessibleBy: [],
  hideFromMenu: ['admin']
};

export const Logout = {
  routeProps: {
    path: '/logout',
    component: RenderUserProfile
  },
  styleProps: {
    icon: <ExitToAppIcon />
  },
  name: t => t('menu.logout'),
  featureName: 'Logout',
  moduleName: 'logout',
  accessibleBy: []
};

export const MyAccount = {
  routeProps: {
    path: '',
    component: <span />
  },
  styleProps: {
    icon: <ManageAccountsIcon />,
    className: 'account-menu-item'
  },
  name: t => t('menu.my_account'),
  featureName: 'Profile',
  accessibleBy: ['admin'],
  subMenu: [Profile, GuestInvitationRoutes, MyMessages, MyForms]
};
