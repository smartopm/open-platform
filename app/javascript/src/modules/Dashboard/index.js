import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import Home from './Components/Home';

export default {
  routeProps: {
    path: '/',
    exact: true,
    component: Home
  },
  styleProps: {
    icon: <HomeIcon />
  },
  name: t => t('menu.dashboard'),
  featureName: 'Dashboard',
  accessibleBy: [
    'admin',
    'client',
    'security_guard',
    'custodian',
    'prospective_client',
    'contractor',
    'resident',
    'visitor',
    'site_worker',
    'site_manager',
    'security_supervisor'
  ]
};