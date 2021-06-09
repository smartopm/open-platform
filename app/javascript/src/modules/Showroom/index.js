import ShowRoom from '../../containers/showroom/Home';
import VisitingReasonScreen from '../../containers/showroom/VisitReasonScreen';
import VisitingClientFormScreen from '../../containers/showroom/CheckInForm';
import CheckInCompleteScreen from '../../containers/showroom/CheckInComplete';

export default {
  routeProps: {
    path: '/showroom_kiosk',
    exact: true,
    component: ShowRoom
  },
  styleProps: {},
  name: t => t('menu.showroom'),
  featureName: 'Showroom',
  accessibleBy: [],
  subRoutes: [
    {
      routeProps: {
        path: '/sh_reason',
        exact: true,
        component: VisitingReasonScreen
      },
      name: 'Showroom Check-In',
      accessibleBy: [],
    },
    {
      routeProps: {
        path: '/sh_entry',
        exact: true,
        component: VisitingClientFormScreen
      },
      name:'Visiting the Nkwashi Showroom',
      accessibleBy: [],
    },
    {
      routeProps: {
        path: '/sh_complete',
        exact: true,
        component: CheckInCompleteScreen
      },
      name:'Check-In Another Visitor',
      accessibleBy: [],
    },
  ]
};
