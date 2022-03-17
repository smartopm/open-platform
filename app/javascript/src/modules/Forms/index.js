import React from 'react'
import DescriptionIcon from '@mui/icons-material/Description';

// There are 2 different types of forms
// forms for the user and forms where admin manages and creates form
// It would be nice to name them differently
const currentModule = 'forms'

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
  moduleName: currentModule,
  accessibleBy: []
};
