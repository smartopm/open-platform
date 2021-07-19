import ReportList from './components/Report';

export default {
  routeProps: {
    path: '/reports',
    component: ReportList
  },
  name: t => t('menu.report'),
  featureName: 'Reports',
  accessibleBy: ['admin'],
  subRoutes: [
    {
      routeProps: {
        path: '/customs_report', // reports/:id
        exact: true,
        component: ReportList // change to actual component that shows one report
      },
      name: 'Customs Report',
      accessibleBy: ['admin']
    }
  ]
};
