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
  name: 'Time Card',
  accessibleBy: ['admin']
};
