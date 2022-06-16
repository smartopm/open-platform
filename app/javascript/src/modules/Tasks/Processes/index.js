import React from 'react';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import ProcessesPage from './Components/ProcessesPage';

const processesPermissions = [
  'can_access_tasks',
  'can_access_processes',
];

const currentModule = 'process';

function RenderProcesses() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={[...processesPermissions]}>
      <ProcessesPage />
    </AccessCheck>
  );
}

export default {
  routeProps: {
    path: '/processes',
    component: RenderProcesses
  },
  styleProps: {
    icon: <SettingsSuggestIcon />,
  },
  name: (t) => t('menu.processes'),
  moduleName: currentModule,
  featureName: 'Processes',
  accessibleBy: []
};
