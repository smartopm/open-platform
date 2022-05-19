import React from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LeadsPage from './Components/LeadsPage'

export default {
  routeProps: {
    path: '/leads',
    component: LeadsPage
  },
  styleProps: {
    icon: <FilterAltIcon />
  },
  name: t => t('menu.leads'),
  moduleName: 'user',
  featureName: 'Users',
  accessibleBy: []
};