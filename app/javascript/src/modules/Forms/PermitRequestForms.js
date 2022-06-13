import React from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import CommunityForms from './containers/FormLinks';
import AccessCheck from '../Permissions/Components/AccessCheck';

// This is a concept of a module that has different types like forms,
// there are forms to be submitted page and forms that have been submitted already
// a module can exist outside and be imported and exported here
const CommunityFormsPermissions = ['can_access_forms'];

const currentModule = 'forms'

function RenderCommunityForms() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={CommunityFormsPermissions}>
      <CommunityForms />
    </AccessCheck>
  )
}

export default {
  routeProps: {
    path: '/forms',
    component: RenderCommunityForms
  },
  styleProps: {
    icon: <DescriptionIcon />,
    className: 'permit-request-form-menu-item'
  },
  name: t => t('menu.request_forms'),
  featureName: 'Forms',
  moduleName: currentModule,
  accessibleBy: []
};
