// These are exportable routes to clean up the route file
import React from 'react';
import UserShow from './Containers/UserShow';
import UserEdit from './Containers/UserEdit';
import UserLogs from './Containers/UserLogs';
import IdPrintPage from '../../containers/IdPrint';
import UserMessagePage from '../../containers/Messages/UserMessagePage';
import OTPFeedbackScreen from '../../containers/OTPScreen';
import UserActions from './Components/UserActions';
import Preferences from '../Preferences/Components/Notifications';
import { allUserTypes } from '../../utils/constants';
import AccessCheck from '../Permissions/Components/AccessCheck';
import LeadManagementDetails from './LeadManagement/Components/LeadManagementDetails';
import EditForm from '../Forms/containers/FormLinks';
import UsersImport from './Containers/UsersImport';
import LeadManagementUserImport from './LeadManagement/Containers/LeadManagementUserImport';
// name in here is only used as key in routes, make sure it is unique

const user = { module: 'user' };

const entryRequest = { module: 'entry_request' };

const editProfilePermissions = ['can_edit_own_profile'];

const logBookPermissions = ['can_access_logbook'];

const otpPermissions = ['can_send_one_time_login'];

const leadManagementPermissions = ['can_update_user_details'];

const CommunityFormsPermissions = ['can_access_forms'];

const userImportPermissions = ['can_create_users_via_csv'];

const currentModule = 'forms';

function RenderCommunityForms() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={CommunityFormsPermissions}>
      <EditForm />
    </AccessCheck>
  );
}

function RenderUserEdit() {
  return (
    <AccessCheck module={user.module} allowedPermissions={editProfilePermissions}>
      <UserEdit />
    </AccessCheck>
  );
}

function RenderOTPFeedbackScreen() {
  return (
    <AccessCheck module={user.module} allowedPermissions={otpPermissions}>
      <OTPFeedbackScreen />
    </AccessCheck>
  );
}

function RenderUserLogs() {
  return (
    <AccessCheck module={entryRequest.module} allowedPermissions={logBookPermissions}>
      <UserLogs />
    </AccessCheck>
  );
}

function RenderLeadManagementTab() {
  return (
    <AccessCheck module={user.module} allowedPermissions={leadManagementPermissions}>
      <LeadManagementDetails />
    </AccessCheck>
  );
}

function RenderUserImport() {
  return (
    <AccessCheck module={user.module} allowedPermissions={userImportPermissions}>
      <UsersImport />
    </AccessCheck>
  );
}

function RenderUserLeadImport() {
  return (
    <AccessCheck module={user.module} allowedPermissions={userImportPermissions}>
      <LeadManagementUserImport />
    </AccessCheck>
  );
}

const routes = [
  {
    routeProps: {
      path: '/user/:id/edit',
      component: RenderUserEdit,
      exact: true
    },
    accessibleBy: [],
    name: 'user_edit',
    moduleName: 'user',
    featureName: 'Users'
  },
  {
    routeProps: {
      path: '/user/:id/lead_management',
      component: RenderLeadManagementTab,
      exact: true
    },
    accessibleBy: [],
    name: 'lead_management',
    moduleName: 'user',
    featureName: 'Users'
  },

  {
    routeProps: {
      path: '/new/user',
      component: RenderUserEdit,
      exact: true
    },
    accessibleBy: [],
    name: 'user_edit',
    moduleName: 'user',
    featureName: 'Users'
  },
  {
    routeProps: {
      path: '/user/:id/logs',
      component: RenderUserLogs,
      exact: true
    },
    accessibleBy: allUserTypes,
    name: 'user_logs',
    moduleName: 'user',
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
    moduleName: 'user',
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
  {
    routeProps: {
      path: '/form/:id/edit',
      component: RenderCommunityForms,
      exact: true
    },
    accessibleBy: allUserTypes,
    name: 'edit_forms',
    featureName: 'Forms'
  },
  {
    routeProps: {
      path: '/users/import',
      exact: true,
      component: RenderUserImport
    },
    accessibleBy: [],
    name: 'user_import',
    moduleName: 'user',
    featureName: 'Users'
  },
  {
    routeProps: {
      path: '/users/leads/import',
      exact: true,
      component: RenderUserLeadImport
    },
    accessibleBy: [],
    name: 'leads_import',
    moduleName: 'user',
    featureName: 'Users'
  }
];

export default routes;
