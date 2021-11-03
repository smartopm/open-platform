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
import CommunitySettings from './components/SettingsPage';
import Tasks from '../Tasks'
import Contact from '../Contact'
import Referral from '../Referrals'
import Showroom from '../Showroom'
import Report from '../Reports'

// we can discuss on changing this to preferences instead of settings
const Settings =   {
  routeProps: {
    path: '/community',
    component: CommunitySettings
  },
  styleProps: {
    icon: <GroupIcon />
  },
  name: t => t('menu.settings'),
  featureName: 'Community',
  moduleName: 'community_settings',
  accessibleBy: [],
}

export default {
  routeProps: {
    path: '',
    component: <span />
  },
  styleProps: {
    icon: <GroupIcon />,
    className: 'community-menu-item'
  },
  name: t => t('menu.community'),
  featureName: 'Community',
  moduleName: 'community',
  accessibleBy: [],
  subMenu: [News, Message, Discussions, Campaigns , Labels, Tasks, Business, PermitRequestForms, Report, Emails, Settings, Contact, Referral, Showroom]
};
