import React from 'react';
import GroupIcon from '@material-ui/icons/Group';
import News from '../News'
import Message from '../Messages'
import Discussions from '../Discussions';
import Business from '../Business';
import Labels from '../Labels';
import Campaigns from '../Campaigns';
import PermitRequestForms from '../Forms/PermitRequestForms';
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '',
    component: <span />
  },
  styleProps: {
    icon: <GroupIcon />
  },
  name: 'Community',
  accessibleBy: allUserTypes,
  subMenu: [News, Message, Discussions, Campaigns , Labels, Business, PermitRequestForms]
};
