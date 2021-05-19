import React from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import CommunityForms from '../../containers/Forms/FormLinks';

// This is a concept of a module that has different types like forms,
// there are forms to be submitted page and forms that have been submitted already
// a module can exist outside and be imported and exported here
export default {
  routeProps: {
    path: '/forms',
    component: CommunityForms
  },
  styleProps: {
    icon: <DescriptionIcon />
  },
  name: t => t('menu.request_forms'),
  featureName: 'Forms',
  accessibleBy: ['admin', 'client', 'resident']
};
