import React from 'react';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import StatsPage from '../../containers/User/StatsPage';

export default {
  routeProps: {
    path: '/users/stats',
    component: StatsPage
  },
  styleProps: {
    icon: <LinearScaleIcon />
  },
  name: 'User Journey Stats',
  accessibleBy: ['admin']
};
