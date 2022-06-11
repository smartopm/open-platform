// import React from 'react'
// import AccessCheck from '../Permissions/Components/AccessCheck';
import AmenityList from './Components/AmenityList';

// const business = { module: 'amenity' }

// const businessPermissions = ['can_access_amenity'];


export default {
  routeProps: {
    path: '/amenities',
    component: AmenityList
  },
  name: t => t('misc.amenity'),
  featureName: 'Business',
  moduleName: "business",
  accessibleBy: []
};
