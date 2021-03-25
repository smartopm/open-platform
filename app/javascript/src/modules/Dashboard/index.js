import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import Home from '../../containers/Home';

export default {
  routeProps: {
    path: '/',
    exact: true,
    component: Home
  },
  styleProps: {
    icon: <HomeIcon />
  },
  name: 'Home',
  // TODO: find a way to simplify this if it is accessible by everyone, something like [] or ['*']
  accessibleBy: [
    'admin',
    'client',
    'security_guard',
    'custodian',
    'prospective_client',
    'contractor',
    'resident',
    'visitor'
  ]
};
