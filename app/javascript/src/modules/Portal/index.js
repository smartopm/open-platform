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
  name: t => t('menu.my_thebe_portal'),
  enabled: enabled => !!enabled,
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
