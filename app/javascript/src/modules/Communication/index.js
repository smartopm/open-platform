import React from 'react'
import ForumIcon from '@material-ui/icons/Forum';

export default {
  routeProps: {
    path: '/communication',
    component: <span />
  },
  styleProps: {
    icon: <ForumIcon />
  },
  name: 'Communication',
  accessibleBy: ['admin']
};
