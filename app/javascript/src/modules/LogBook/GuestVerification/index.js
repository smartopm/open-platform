import GuestValidate from './Containers/GuestValidate';
import RequestUpdatePage from '../Components/RequestUpdatePage';
import { guestListUsers } from '../../../utils/constants';

const GuestsValidatorRoutes = [
  {
    routeProps: {
      path: '/request/:id?/:logs?',
      component: GuestValidate,
    },
    name: 'Request Details',
    featureName: 'LogBook',
    accessibleBy: guestListUsers,
  },
  {
    routeProps: {
      path: '/visit_request',
      component: RequestUpdatePage,
    },
    name: 'Visit Request',
    featureName: 'LogBook',
    accessibleBy: guestListUsers,
  },
];

export default GuestsValidatorRoutes;
