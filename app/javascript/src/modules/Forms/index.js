import React from 'react'
import DescriptionIcon from '@material-ui/icons/Description';

// There are 2 different types of forms
// forms for the user and forms where admin manages and creates form
// It would be nice to name them differently
export default {
  routeProps: {
    path: '/myforms', // myforms
    component: <span />,
  },
  styleProps: {
    icon: <DescriptionIcon />
  },
  name: t => t('menu.form', { count: 0 }),
  featureName: 'Forms',
  accessibleBy: [
    'client',
    'prospective_client',
    'contractor',
    'resident',
  ]
};
