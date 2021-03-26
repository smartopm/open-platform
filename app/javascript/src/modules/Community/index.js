import React from 'react';
import GroupIcon from '@material-ui/icons/Group';
import News from '../News'

const Community = () => <div>Community Module</div>;

export default {
  routeProps: {
    path: '/community',
    component: Community
  },
  styleProps: {
    icon: <GroupIcon />
  },
  name: 'Community',
  accessibleBy: [
    'admin',
    'client',
    'security_guard',
    'prospective_client',
    'contractor',
    'resident',
    'visitor'
  ],
  subMenu: [News]
};
