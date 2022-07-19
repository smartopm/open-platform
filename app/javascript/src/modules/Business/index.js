import React from 'react'
import Businesses from './Components/Businesses';
import AccessCheck from '../Permissions/Components/AccessCheck';

const business = { module: 'business' }

const businessPermissions = ['can_access_business'];

function RenderBusinesses() {
  return (
    <AccessCheck module={business.module} allowedPermissions={businessPermissions}>
      <Businesses />
    </AccessCheck>
  )
}
export default {
  routeProps: {
    path: '/businesses',
    component: RenderBusinesses
  },
  name: t => t('misc.business_directory'),
  featureName: 'Business',
  moduleName: "business",
  accessibleBy: []
};
