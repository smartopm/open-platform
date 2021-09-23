import React from 'react'
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EntryLogs from './Components/EntryLogs';
import GuestList from './GuestList/Components/GuestList'
import GuestUpdate from './GuestList/containers/GuestUpdate'
import { siteManagers } from '../../utils/constants';

import PeopleIcon from '@material-ui/icons/People';
import RequestUpdate from './Components/RequestUpdate';


const GuestsList =  {
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
    },
    {
      routeProps: {
        path: '/guest-list/new-guest-entry',
        exact: true,
        component: RequestUpdate
      },
      name: 'RequestUpdate',
      accessibleBy: siteManagers
    }
  ]

};


const LogBooks = {
  routeProps: {
    path: '/entry_logs',
    component: EntryLogs
  },
  styleProps: {
    icon: <MenuBookIcon />
  },
  name: t => t('misc.log_book'),
  featureName: 'LogBook',
  accessibleBy: ['admin', 'security_guard', 'custodian'],
};


export default {
  routeProps: {
    path: '/entry_logs',
    component: EntryLogs
  },
  styleProps: {
    icon: <MenuBookIcon />
  },
  name: t => t('misc.log_book'),
  featureName: 'LogBook',
  accessibleBy: ['admin', 'security_guard', 'custodian'],
  subMenu: [LogBooks, GuestsList]
};