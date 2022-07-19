import React from 'react';
import MessageIcon from '@mui/icons-material/Message';
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/mymessages',
    // eslint-disable-next-line react/display-name
    component: () => <span />
  },
  styleProps: {
    icon: <MessageIcon />
  },
  name: t => t('menu.my_messages'),
  featureName: 'Messages',
  accessibleBy: allUserTypes,
  hideFromMenu: ['admin']
};