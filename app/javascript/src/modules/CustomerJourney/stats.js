import React from 'react';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
// TODO: Move this to customer journey module
import StatsPage from "../Users/Containers/StatsPage";

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
