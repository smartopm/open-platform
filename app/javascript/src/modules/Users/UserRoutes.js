// These are exportable routes to clean up the route file
import UserShow from '../../containers/UserShow';
import UserEdit from '../../containers/UserEdit';
import UserLogs from '../../containers/AllLogs/UserLogs';
import IdPrintPage from '../../containers/IdPrint';
import UserMessagePage from '../../containers/Messages/UserMessagePage';
import OTPFeedbackScreen from '../../containers/OTPScreen';
import { allUserTypes } from '../../utils/constants';

// name in here is only used as key in routes, make sure it is unique

const routes = [
  {
    routeProps: {
      path: '/user/:id',
      component: UserShow
    },
    accessibleBy: allUserTypes,
    name: 'user_info'
  },
  {
    routeProps: {
      path: '/user/:id/logs',
      component: UserLogs
    },
    accessibleBy: ['admin'],
    name: 'user_logs'
  },
  {
    routeProps: {
      path: '/user/:id/edit',
      component: UserEdit
    },
    accessibleBy: allUserTypes,
    name: 'user_edit'
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
      path: '/user/:id/otp',
      component: OTPFeedbackScreen
    },
    accessibleBy: ['admin'],
    name: 'user_otp'
  },
];

export default routes;
