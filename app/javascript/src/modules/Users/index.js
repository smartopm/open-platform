import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import Users from '../../containers/Users';

// for nested links, I think these will likely be on the user
// we can have a to prop and substitute once we are on the right menu
// to: '/user/id:',
// to: '/messages/:id',
// to: '/plots/id:'
export default {
  routeProps: {
    path: '/users',
    component: Users
  },
  styleProps: {
    icon: <PersonIcon />
  },
  name: 'Users',
  accessibleBy: ['admin']
};
