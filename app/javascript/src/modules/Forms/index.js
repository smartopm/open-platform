import React from 'react'
import DescriptionIcon from '@material-ui/icons/Description';

const Forms = () => <h4>Forms Module</h4>

// There are 2 different types of forms
// forms for the user and forms where admin manages and creates form
// It would be nice to name them differently
export default {
  routeProps: {
    path: '/forms',
    component: Forms
  },
  styleProps: {
    icon: <DescriptionIcon />
  },
  name: 'Forms',
  accessibleBy: [
    'admin',
    'client',
    'security_guard',
    'prospective_client',
    'contractor',
    'resident',
    'visitor'
  ]
};
