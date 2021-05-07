import React from 'react'
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EntryLogs from '../../containers/AllLogs/EntryLogs';

export default {
  routeProps: {
    path: '/entry_logs',
    component: EntryLogs
  },
  styleProps: {
    icon: <MenuBookIcon />
  },
  name: t => t('misc.log_book'),
  accessibleBy: ['admin', 'security_guard', 'custodian']
};
