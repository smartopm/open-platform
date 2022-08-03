import React from 'react';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import UserStats from './Components/UserStats';

export default {
  routeProps: {
    path: '/users/stats',
    component: UserStats
  },
  styleProps: {
    icon: <LinearScaleIcon />
  },
  name: t => t('menu.user_journey_stats'),
  featureName: 'UserStats',
  accessibleBy: ['admin']
};
