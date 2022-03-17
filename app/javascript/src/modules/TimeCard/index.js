import React from 'react'
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import CustodianLogs from './Components/CustodianLogs';
import AccessCheck from '../Permissions/Components/AccessCheck';

const timeSheetsPermissions = ['can_access_all_timesheets'];
const currentModule = 'timesheet';

function RenderTimeSheets() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={timeSheetsPermissions}>
      <CustodianLogs />
    </AccessCheck>
  )
}

export default {
  routeProps: {
    path: '/timesheet',
    component: RenderTimeSheets
  },
  styleProps: {
    icon: <HourglassFullIcon />
  },
  name: t => t('misc.time_card'),
  featureName: 'Time Card',
  accessibleBy: [],
  moduleName: currentModule
};
