import React from 'react'
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EntryLogs from './Components/EntryLogs';
import GuestsList from './GuestList';
import GuestVerification from './GuestVerification';


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
  accessibleBy: ['admin', 'security_guard'],
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
  accessibleBy: ['admin', 'security_guard', 'resident', 'client', 'custodian'],
  subMenu: [LogBooks, GuestsList, GuestVerification]
};