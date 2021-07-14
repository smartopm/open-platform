import React from 'react';
import MapIcon from '@material-ui/icons/Map';
import Contact from './Components/Support';
import Map from '../../containers/Map'
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/contact',
    component: Contact
  },
  accessibleBy: allUserTypes,
  name: t => t('menu.contact'),
  featureName: 'Contact',
};

export const Maps = {
  routeProps: {
    path: '/map',
    component: Map
  },
  styleProps: {
    icon: <MapIcon />
  },
  name: t => t('menu.maps'),
  featureName: 'Contact',
  accessibleBy: allUserTypes
}