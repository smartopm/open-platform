import React from 'react'
import EmailBuilderDialog from './components/EmailBuilderDialog';
import MailTemplateList from './components/MailTemplateList';
import AccessCheck from '../Permissions/Components/AccessCheck';


const MailTemplateListPermissions = ['can_create_email_template', 'can_view_email_templates'];
const currentModule = 'email_template'

function renderMailTemplateList() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={MailTemplateListPermissions} show404ForUnauthorized>
      <MailTemplateList />
    </AccessCheck>
  )
}

function renderEmailBuilderDialog() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={MailTemplateListPermissions}>
      <EmailBuilderDialog />
    </AccessCheck>
  )
}


export default {
  routeProps: {
    path: '/mail_templates',
    exact: true,
    component: renderMailTemplateList
  },
  name: t => t('menu.email_templates'),
  featureName: 'Email Templates',
  accessibleBy: [],
  moduleName: currentModule,
  subRoutes: [
    {
      routeProps: {
        path: '/mail_templates/new',
        exact: true,
        component: renderEmailBuilderDialog
      },
      name: 'Mail Template Builder',
      accessibleBy: []
    },
  ]
};
