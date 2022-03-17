import React from 'react'
import ComputerIcon from '@mui/icons-material/Computer';
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
  featureName: 'My Thebe Portal',
  accessibleBy: [
    'admin',
    'client',
    'prospective_client',
    'resident',
  ]
};
