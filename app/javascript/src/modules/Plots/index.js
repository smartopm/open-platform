import React from 'react'
import MapIcon from '@material-ui/icons/Map';

// get the current user 
const Plots = () => <h4>My Plots Module</h4>

export default {
  routeProps: {
    path: '/plots',
    component: Plots
  },
  styleProps: {
    icon: <MapIcon />
  },
  name: 'Plots',
  accessibleBy: [
    'client',
    'resident',
  ]
};
