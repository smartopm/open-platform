import React from 'react'
import ForumIcon from '@material-ui/icons/Forum';
import ActionFlows from '../../containers/ActionFlows/ActionFlows';

export default {
  routeProps: {
    path: '/action_flows',
    component: ActionFlows
  },
  styleProps: {
    icon: <ForumIcon />
  },
  name: 'Action Flows',
  accessibleBy: ['admin']
};
