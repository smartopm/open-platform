import GuestValidate from './Containers/GuestValidate';
import { guestListUsers } from '../../../utils/constants';

const GuestsValidatorRoutes = [
  {
    routeProps: {
      path: '/request/:id?/:logs?',
      component: GuestValidate,
    },
    name: 'Request Details',
    featureName: 'LogBook',
    accessibleBy: [...guestListUsers, 'visitor'],
  },
  {
    routeProps: {
      path: '/visit_request',
      component: GuestValidate,
    },
    name: 'Visit Request',
    featureName: 'LogBook',
    accessibleBy: guestListUsers,
  },
];

export default GuestsValidatorRoutes;
