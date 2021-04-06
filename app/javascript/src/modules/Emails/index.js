import MailTemplateList from './components/MailTemplateList';

export default {
  routeProps: {
    path: '/mail_templates',
    exact: true,
    component: MailTemplateList
  },
  name: 'Email Templates',
  accessibleBy: ['admin']
};
