import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import Home from './Components/Home';
import AccessCheck from '../Permissions/Components/AccessCheck';

const dashboardPermissions = ['can_access_dashboard'];
const currentModule = 'dashboard'
function RenderDashboard() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={dashboardPermissions}>
      <Home />
    </AccessCheck>
  )
}

export default {
  routeProps: {
    path: '/',
    exact: true,
    component: RenderDashboard
  },
  styleProps: {
    icon: <HomeIcon />
  },
  name: t => t('menu.dashboard'),
  featureName: 'Dashboard',
  moduleName: 'dashboard',
  accessibleBy: []
};