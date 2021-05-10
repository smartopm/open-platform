// These are exportable routes to clean up the route file
import UserShow from './Containers/UserShow';
import UserEdit from './Containers/UserEdit';
import UserLogs from '../../containers/AllLogs/UserLogs';
import IdPrintPage from '../../containers/IdPrint';
import UserMessagePage from '../../containers/Messages/UserMessagePage';
import OTPFeedbackScreen from '../../containers/OTPScreen';
import UserActions from './Components/UserActions'
import Preferences from '../Preferences/Components/Notifications'
import { allUserTypes } from '../../utils/constants';

// name in here is only used as key in routes, make sure it is unique

const routes = [
  {
    routeProps: {
      path: '/user/:id/edit',
      component: UserEdit,
      exact: true,
    },
    accessibleBy: allUserTypes,
    name: 'user_edit'
  },
  {
    routeProps: {
      path: '/user/:id/logs',
      component: UserLogs,
      exact: true,
    },
    accessibleBy: ['admin'],
    name: 'user_logs'
  },
  {
    routeProps: {
      path: '/user/:id/otp',
      component: OTPFeedbackScreen,
      exact: true,
    },
    accessibleBy: ['admin'],
    name: 'user_otp'
  },
  {
    routeProps: {
      path: '/user/settings',
      component: UserActions,
      exact: true
    },
    accessibleBy: allUserTypes,
    name: 'user_actions'
  },
  {
    routeProps: {
      path: '/user/:id/:tm?/:dg?',
      component: UserShow
    },
    accessibleBy: allUserTypes,
    name: 'user_info'
  },
  {
    routeProps: {
      path: '/print/:id/',
      component: IdPrintPage
    },
    accessibleBy: allUserTypes,
    name: 'print_id'
  },
  {
    routeProps: {
      path: '/message/:id/',
      component: UserMessagePage
    },
    accessibleBy: allUserTypes,
    name: 'user_message'
  },
  {
    routeProps: {
      path: '/settings',
      component: Preferences,
      exact: true
    },
    accessibleBy: allUserTypes,
    name: 'Preferences'
  }
];

export default routes;
