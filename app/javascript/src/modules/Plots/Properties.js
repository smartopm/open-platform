import React from 'react';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LandParcelPage from '../../containers/LandParcels/LandParcel';
import AccessCheck from '../Permissions/Components/AccessCheck';
// This is a concept of a module that has different types like forms, we have admin page and client
// a module can exist outside and be imported and exported here

const landParcelPermissions = ['can_view_all_land_parcels'];
const currentModule = 'land_parcel';

function RenderLandParcels() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={landParcelPermissions}>
      <LandParcelPage />
    </AccessCheck>
  )
}

export default {
  routeProps: {
    path: '/land_parcels',
    component: RenderLandParcels
  },
  styleProps: {
    icon: <HomeWorkIcon />,
    className: 'properties-menu-item'
  },
  name: t => t('misc.properties'),
  featureName: 'Properties',
  moduleName: currentModule,
  accessibleBy: []
};
