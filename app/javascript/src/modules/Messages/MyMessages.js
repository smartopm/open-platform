import React from 'react';
import MessageIcon from '@material-ui/icons/Message';
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
  accessibleBy: allUserTypes,
  name: t => t('menu.my_messages')
};