import React from 'react'
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import CustodianLogs from '../../containers/TimeSheet/CustodianLogs';

export default {
  routeProps: {
    path: '/timesheet',
    component: CustodianLogs
  },
  styleProps: {
    icon: <HourglassFullIcon />
  },
  name: t => t('misc.time_card'),
  enabled: enabled => !!enabled,
  accessibleBy: ['admin', 'custodian']
};
