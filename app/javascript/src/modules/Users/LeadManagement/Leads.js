import React from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LeadsPage from './Components/LeadsPage';
import { RenderUsers } from '..';

const currentModule = 'lead';

export default {
  routeProps: {
    path: '/leads',
    component: LeadsPage
  },
  styleProps: {
    icon: <FilterAltIcon />
  },
  name: t => t('menu.leads'),
  moduleName: currentModule,
  featureName: 'Leads',
  accessibleBy: [],
  subMenu: [
    {
      routeProps: {
        path: '/leads',
        component: LeadsPage,
        exact: true
      },
      name: t => t('lead_management.scorecard'),
      featureName: 'Scorecard',
      moduleName: currentModule,
      accessibleBy: []
    },
    {
      routeProps: {
        path: '/leads/users',
        component: RenderUsers
      },
      name: t => t('menu.lead_users'),
      featureName: 'Lead Users',
      moduleName: currentModule,
      accessibleBy: []
    }
  ]
};
