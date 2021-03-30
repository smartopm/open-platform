import React from 'react'
import ForumIcon from '@material-ui/icons/Forum';
import Campaigns from '../../containers/Campaigns/Campaigns';

export default {
  routeProps: {
    path: '/campaigns',
    component: Campaigns
  },
  styleProps: {
    icon: <ForumIcon />
  },
  name: 'Campaigns',
  accessibleBy: ['admin']
};
