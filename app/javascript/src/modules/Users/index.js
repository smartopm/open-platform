import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Users from './Containers/Users';
import UserShow from './Containers/UserShow';
import { allUserTypes } from '../../utils/constants';
import AccessCheck from '../Permissions/Components/AccessCheck';


const currentModule = 'user'

const userPermissions = ['can_access_all_users'];

function RenderUsers() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={userPermissions}>
      <Users />
    </AccessCheck>
)
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
  moduleName: currentModule,
  featureName: 'Users',
  accessibleBy: []
};

// temporarily export the user profile page here, these will be part of the core user module
// TODO: @olivier remove after merging the subroutes implementation
export const Profile = {
  routeProps: {
    path: '/myprofile',
    component: UserShow
  },
  styleProps: {
    icon: <AccountCircleIcon />,
    className: 'my-profile-menu-item'
  },
  name: t => t('menu.my_profile'),
  featureName: 'Profile',
  accessibleBy: allUserTypes
}

export const Logout = {
  routeProps: {
    path: '/logout',
    component: UserShow
  },
  styleProps: {
    icon: <ExitToAppIcon />
  },
  name: t => t('menu.logout'),
  featureName: 'Logout',
  accessibleBy: allUserTypes
}