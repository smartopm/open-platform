import React from 'react'
import { SearchOutlined } from '@material-ui/icons';
import ReportList from './components/Report';

export default {
  routeProps: {
    path: '/reports',
    component: ReportList
  },
  styleProps: {
    icon: <SearchOutlined />
  },
  name: t => t('menu.report'),
  featureName: 'Reports',
  accessibleBy: ['admin'],
  subRoutes: [
    {
      routeProps: {
        path: '/customs_report', // reports/:id
        exact: true,
        component: ReportList
      },
      name: 'Customs Report',
      accessibleBy: ['admin']
    }
  ]
};
