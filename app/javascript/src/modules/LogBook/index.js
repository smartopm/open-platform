import React from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EntryLogs from './Components/EntryLogs';
// logbook submodules
import GuestsList from './GuestList';
import GuestsValidateRoutes from './GuestVerification';
import { guestListUsers } from '../../utils/constants';

const LogBooks = {
  routeProps: {
    path: '/entry_logs',
    component: EntryLogs,
  },
  styleProps: {
    icon: <MenuBookIcon />,
  },
  name: (t) => t('misc.log_book'),
  featureName: 'LogBook',
  accessibleBy: ['admin', 'security_guard'],
  subRoutes: [...GuestsValidateRoutes],
};

export default {
  routeProps: {
    path: '/entry_logs',
    component: EntryLogs,
  },
  styleProps: {
    icon: <MenuBookIcon />,
  },
  name: (t) => t('misc.log_book'),
  featureName: 'LogBook',
  accessibleBy: guestListUsers,
  subMenu: [LogBooks, GuestsList],
};
