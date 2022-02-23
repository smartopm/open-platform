import React from 'react';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import ProcessesPage from './Components/ProcessesPage';

const processesPermissions = [
  'can_access_tasks',
  'can_access_processes',
];

const currentModule = 'note';

function RenderProcesses() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={[...processesPermissions]}>
      <ProcessesPage />
    </AccessCheck>
  );
}

// This will be in use when processes is added as a menu it
// Processes page is currently accessible via quick link
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
