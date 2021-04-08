import React from 'react'
import CenteredContent from '../../components/CenteredContent';
import MailTemplateList from './components/MailTemplateList';


const Details = () => <CenteredContent>Template Design</CenteredContent>
const subRoutes = [
  {
    routeProps: {
      path: '/mail_templates/:id',
      exact: true,
      component: Details
    },
    name: 'Email Templates Design',
    accessibleBy: ['admin'],
  },
]

export default {
  routeProps: {
    path: '/mail_templates',
    exact: true,
    component: MailTemplateList
  },
  name: 'Email Templates',
  accessibleBy: ['admin'],
  included: true,
  subRoutes,
};
