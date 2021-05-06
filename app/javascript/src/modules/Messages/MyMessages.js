import React from 'react';
import MessageIcon from '@material-ui/icons/Message';
import { allUserTypes } from '../../utils/constants';

export default {
  routeProps: {
    path: '/mymessages',
    component: <span />
  },
  styleProps: {
    icon: <MessageIcon />
  },
  accessibleBy: allUserTypes,
  name: 'My Messages'
};