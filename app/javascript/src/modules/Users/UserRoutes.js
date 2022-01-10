// These are exportable routes to clean up the route file
import React from 'react'
import UserShow from './Containers/UserShow';
import UserEdit from './Containers/UserEdit';
import UserLogs from './Containers/UserLogs';
import IdPrintPage from '../../containers/IdPrint';
import UserMessagePage from '../../containers/Messages/UserMessagePage';
import OTPFeedbackScreen from '../../containers/OTPScreen';
import UserActions from './Components/UserActions'
import Preferences from '../Preferences/Components/Notifications'
import { allUserTypes } from '../../utils/constants';
import AccessCheck from '../Permissions/Components/AccessCheck';
// name in here is only used as key in routes, make sure it is unique


const user = { module: 'user' }

const entryRequest = { module: 'entry_request' }

const editProfilePermissions = ['can_edit_own_profile'];

const logBookPermissions = ['can_access_logbook'];

const otpPermissions = ['can_send_one_time_login']

function RenderUserEdit() {
  return (
    <AccessCheck module={user.module} allowedPermissions={editProfilePermissions}>
      <UserEdit />
    </AccessCheck>
)
}

function RenderOTPFeedbackScreen() {
  return (
    <AccessCheck module={user.module} allowedPermissions={otpPermissions}>
      <OTPFeedbackScreen />
    </AccessCheck>
)
}

function RenderUserLogs() {
  return (
    <AccessCheck module={entryRequest.module} allowedPermissions={logBookPermissions}>
      <UserLogs />
    </AccessCheck>
)
}

const routes = [
  {
    routeProps: {
      path: '/user/:id/edit',
      component: RenderUserEdit,
      exact: true,
    },
    accessibleBy: [],
    name: 'user_edit',
    moduleName: "user",
    featureName: 'Users'
  },
  {
    routeProps: {
      path: '/new/user',
      component: RenderUserEdit,
      exact: true,
  },
    accessibleBy: [],
    name: 'user_edit',
    moduleName: "user",
    featureName: 'Users',
  },
  {
    routeProps: {
      path: '/user/:id/logs',
      component: RenderUserLogs,
      exact: true,
    },
    accessibleBy: allUserTypes,
    name: 'user_logs',
    moduleName: "user",
    featureName: 'Users'
  },
  {
    routeProps: {
      path: '/user/:id/otp',
      component: RenderOTPFeedbackScreen,
      exact: true
    },
    accessibleBy: [],
    name: 'user_otp',
    moduleName: "user",
    featureName: 'Users'
  },
  {
    routeProps: {
      path: '/user/settings',
      component: UserActions,
      exact: true
    },
    accessibleBy: allUserTypes,
    name: 'user_actions',
    featureName: 'Users'
  },
  {
    routeProps: {
      path: '/user/:id/:tm?/:dg?',
      component: UserShow
    },
    accessibleBy: allUserTypes,
    name: 'user_info',
    featureName: 'Users'
  },
  {
    routeProps: {
      path: '/print/:id/',
      component: IdPrintPage
    },
    accessibleBy: allUserTypes,
    name: 'print_id',
    featureName: 'Users'
  },
  {
    routeProps: {
      path: '/message/:id/',
      component: UserMessagePage
    },
    accessibleBy: allUserTypes,
    name: 'user_message',
    featureName: 'Messages'
  },
  {
    routeProps: {
      path: '/settings',
      component: Preferences,
      exact: true
    },
    accessibleBy: allUserTypes,
    name: 'Preferences',
    featureName: 'Preferences'
  },
];

export default routes;
