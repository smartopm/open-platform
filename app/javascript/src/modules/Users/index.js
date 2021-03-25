import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import Users from '../../containers/Users';

export default {
  routeProps: {
    path: '/users',
    component: Users
  },
  styleProps: {
    icon: <PeopleIcon />
  },
  name: 'Users',
  accessibleBy: ['admin'],
};
