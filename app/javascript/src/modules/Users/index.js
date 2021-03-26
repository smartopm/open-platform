import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import Users from '../../containers/Users';


export default {
  routeProps: {
    path: '/users',
    component: Users
  },
  styleProps: {
    icon: <PersonIcon />
  },
  name: 'Users',
  accessibleBy: ['admin'],
};
