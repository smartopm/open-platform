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
  name: t => t('menu.plot', { count: 0 }),
  enabled: enabled => !!enabled,
  accessibleBy: [
    'client',
    'resident',
  ]
};

export { PlotDetail }
