import React from 'react'
import LinearScaleIcon from '@material-ui/icons/LinearScale';

export default {
  routeProps: {
    path: '/user_journey',
    component: <span />
  },
  styleProps: {
    icon: <LinearScaleIcon />
  },
  name: 'Customer Journey',
  accessibleBy: [
    'client',
    'resident',
  ]
};
