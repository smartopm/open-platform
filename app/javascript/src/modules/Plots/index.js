import React from 'react'
import MapIcon from '@material-ui/icons/Map';
import PlotDetail from './PlotDetail'

export default {
  routeProps: {
    path: '/plots',
    component: <span />
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

export { PlotDetail }
