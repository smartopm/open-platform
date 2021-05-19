import MailTemplateList from './components/MailTemplateList';


export default {
  routeProps: {
    path: '/mail_templates',
    exact: true,
    component: MailTemplateList
  },
  name: t => t('menu.email_templates'),
  featureName: 'Email Templates',
  accessibleBy: ['admin'],
};
