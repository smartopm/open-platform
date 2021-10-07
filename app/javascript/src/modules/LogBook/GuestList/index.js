import React from 'react';
import { guestListUsers } from '../../../utils/constants';
import RequestUpdate from '../Components/RequestUpdate';
import GuestList from './Components/GuestList';
import GuestUpdate from './containers/GuestUpdate';
import PeopleIcon from '@material-ui/icons/People';


// TODO: routes should be changed to _ instead of -
const GuestsList = {
  routeProps: {
    path: '/guest-list',
    component: GuestList,
  },
  styleProps: {
    icon: <PeopleIcon />,
  },
  name: (t) => t('menu.guest_list'),
  featureName: 'Guest List',
  accessibleBy: guestListUsers,

  subRoutes: [
    {
      routeProps: {
        path: '/guest-list/:guestListEntryId',
        exact: true,
        component: GuestUpdate,
      },
      name: 'GuestUpdate',
      accessibleBy: guestListUsers,
    },
    {
      routeProps: {
        path: '/guest-list/new-guest-entry',
        exact: true,
        component: RequestUpdate,
      },
      name: 'RequestUpdate',
      accessibleBy: guestListUsers,
    },
  ],
};

export default GuestsList;
