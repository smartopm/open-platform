import React from 'react'
import ComputerIcon from '@material-ui/icons/Computer';
import NkwashiAccountManagement from '../../containers/NkwashiAccountManagement';

export default {
  routeProps: {
    path: '/account',
    component: NkwashiAccountManagement
  },
  styleProps: {
    icon: <ComputerIcon />
  },
  name: 'My Thebe Portal',
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
