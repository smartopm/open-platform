// try a concept of a right menu where an admin can access modules for any user
import React from 'react'
import DescriptionIcon from '@material-ui/icons/Description';

// There are 2 different types of forms
// forms for the user and forms where admin manages and creates form
// It would be nice to name them differently
export default {
  routeProps: {
    path: '/user/:id/myforms', // myforms
    component: <span />,
  },
  styleProps: {
    icon: <DescriptionIcon />
  },
  name: 'Forms',
  accessibleBy: [
    'admin',
    'client',
    'prospective_client',
    'contractor',
    'resident',
  ]
};
