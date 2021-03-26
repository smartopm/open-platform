import React from 'react'
import LinearScaleIcon from '@material-ui/icons/LinearScale';

const CustomerJourney = () => <h4>My Journey Module</h4>

export default {
  routeProps: {
    path: '/user_journey',
    component: CustomerJourney
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
