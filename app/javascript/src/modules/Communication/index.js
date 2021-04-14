import React from 'react'
import ForumIcon from '@material-ui/icons/Forum';

// This is currently redirecting to /message/userId
// Keep this hidden until fully agreed
export default {
  routeProps: {
    path: '/communication',
    component: <span />
  },
  styleProps: {
    icon: <ForumIcon />
  },
  name: 'Communication',
  accessibleBy: ['']
};