import React from 'react'
import ForumIcon from '@material-ui/icons/Forum';

const Communication = () => <h4>Communication Module</h4>

export default {
  routeProps: {
    path: '/communication',
    component: Communication
  },
  styleProps: {
    icon: <ForumIcon />
  },
  name: 'Communication',
  accessibleBy: ['admin']
};
