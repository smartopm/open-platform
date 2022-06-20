import React from 'react';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import CommunityForms from './containers/FormLinks';
import AccessCheck from '../Permissions/Components/AccessCheck';

// This is a concept of a module that has different types like forms,
// there are forms to be submitted page and forms that have been submitted already
// a module can exist outside and be imported and exported here
const CommunityFormsPermissions = ['can_create_form'];

const currentModule = 'forms';

function RenderCommunityForms() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={CommunityFormsPermissions}>
      <CommunityForms />
    </AccessCheck>
  );
}

export default {
  routeProps: {
    path: '/forms',
    component: RenderCommunityForms
  },
  styleProps: {
    icon: <DynamicFormIcon />,
    className: 'manage-forms-form-menu-item'
  },
  name: t => t('menu.manage_forms'),
  featureName: 'Forms',
  moduleName: currentModule,
  accessibleBy: []
};
