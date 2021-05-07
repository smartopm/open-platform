import React from 'react';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import UserStats from './Components/UserStats';

export default {
  routeProps: {
    path: '/users/stats',
    component: UserStats
  },
  styleProps: {
    icon: <LinearScaleIcon />
  },
  name: 'User Journey Stats',
  accessibleBy: ['admin']
};
