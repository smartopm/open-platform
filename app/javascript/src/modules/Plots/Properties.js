import React from 'react';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import LandParcelPage from '../../containers/LandParcels/LandParcel';

// This is a concept of a module that has different types like forms, we have admin page and client
// a module can exist outside and be imported and exported here
export default {
  routeProps: {
    path: '/land_parcels',
    component: LandParcelPage
  },
  styleProps: {
    icon: <HomeWorkIcon />
  },
  name: t => t('misc.properties'),
  enabled: enabled => !!enabled,
  featureName: 'Properties',
  accessibleBy: ['admin']
};
