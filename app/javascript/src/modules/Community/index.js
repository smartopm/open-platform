import React from 'react';
import GroupIcon from '@material-ui/icons/Group';
import News from '../News'
import Message from '../Messages'
import Discussions from '../Discussions';
import Business from '../Business';
import Labels from '../Labels';
import Campaigns from '../Campaigns';
import PermitRequestForms from '../Forms/PermitRequestForms';
import Emails from '../Emails';
import { allUserTypes } from '../../utils/constants';
import CommunitySettings from './components/SettingsPage';
import Tasks from '../Tasks'
import Contact from '../Contact'

// we can discuss on changing this to preferences instead of settings
const Settings =   {
  routeProps: {
    path: '/community',
    component: CommunitySettings
  },
  styleProps: {
    icon: <GroupIcon />
  },
  name: 'Settings',
  accessibleBy: ['admin'],
}

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
  subMenu: [News, Message, Discussions, Campaigns , Labels, Tasks, Business, PermitRequestForms, Emails, Settings, Contact]
};
