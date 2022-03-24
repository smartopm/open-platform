import React from 'react'
import MapIcon from '@material-ui/icons/Map';
import ExploreIcon from '@material-ui/icons/Explore';
import PlotDetail from './PlotDetail'
import Map from '../../containers/Map'
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/plots',
    component: <span />
  },
  styleProps: {
    icon: <MapIcon />
  },
  name: t => t('menu.plot', { count: 0 }),
  featureName: 'Properties',
  accessibleBy: [
    'client',
    'resident',
  ]
};

export const Maps = {
  routeProps: {
    path: '/map',
    component: Map
  },
  styleProps: {
    icon: <ExploreIcon />
  },
  name: t => t('menu.maps'),
  featureName: 'Properties',
  accessibleBy: allUserTypes
}

export { PlotDetail }
