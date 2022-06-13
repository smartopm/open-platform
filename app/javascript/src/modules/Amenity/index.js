import React from 'react';
import AccessCheck from '../Permissions/Components/AccessCheck';
import AmenityList from './Components/AmenityList';

export function RenderAmenities() {
  return (
    <AccessCheck module="amenity" allowedPermissions={['can_access_amenities']}>
      <AmenityList />
    </AccessCheck>
  );
}

export default {
  routeProps: {
    path: '/amenities',
    component: RenderAmenities
  },
  name: t => t('misc.amenity', { count: 0 }),
  featureName: 'Business',
  moduleName: 'business',
  accessibleBy: []
};
