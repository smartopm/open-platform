import React from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LeadsPage from './Components/LeadsPage'
import { RenderUsers } from '..';

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
  accessibleBy: [],
  subMenu: [
    {
      routeProps: {
        path: '/leads',
        component: LeadsPage,
        exact: true
      },
      name: t => t('lead_management.scorecard'),
      featureName: 'Users',
      moduleName: 'user',
      accessibleBy: []
    },
    {
      routeProps: {
        path: '/leads/users',
        component: RenderUsers,
      },
      name: t => t('menu.lead_users'),
      featureName: 'Users',
      moduleName: 'user',
      accessibleBy: []
    }
  ]
};