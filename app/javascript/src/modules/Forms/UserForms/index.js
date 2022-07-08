import React from 'react'
import DescriptionIcon from '@mui/icons-material/Description';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import FormUserList from './Components/FormUserList';

// There are 2 different types of forms
// forms for the user and forms where admin manages and creates form
// It would be nice to name them differently
const currentModule = 'my_forms'
const myFormsPermissions = ['can_access_own_forms'];


export function RenderMyForms() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={myFormsPermissions}>
      <FormUserList />
    </AccessCheck>
  );
}

export default {
  routeProps: {
    path: '/myforms', // myforms
    component: RenderMyForms
  },
  styleProps: {
    icon: <DescriptionIcon />
  },
  name: t => t('menu.form', { count: 0 }),
  featureName: 'MyForms',
  moduleName: currentModule,
  accessibleBy: []
};
