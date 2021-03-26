import React from 'react';
import GroupIcon from '@material-ui/icons/Group';
import News from '../News'
import Message from '../Messages'
import Discussions from '../Discussions';
import Business from '../Business';

const Community = () => <div>Community Module</div>;

export default {
  routeProps: {
    path: '',
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
  subMenu: [News, Message, Discussions, Business]
};
