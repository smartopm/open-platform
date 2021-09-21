
import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import GuestList from './Components/GuestList';
import { siteManagers } from '../../utils/constants';
import GuestUpdate from './containers/GuestUpdate'

export default  {
  routeProps: {
    path: '/guest-list',
    component: GuestList
  },
  styleProps: {
    icon: <PeopleIcon />
  },
  name: t => t('menu.guest_list'),
  featureName: 'Guest List',
  accessibleBy: siteManagers,

  subRoutes: [
    {
      routeProps: {
        path: '/guest-list/:guestListEntryId',
        exact: true,
        component: GuestUpdate
      },
      name: 'GuestUpdate',
      accessibleBy: siteManagers
    }
  ]

};
