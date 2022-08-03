import React from 'react'
import ForumIcon from '@mui/icons-material/Forum';
import ActionFlows from '../../containers/ActionFlows/ActionFlows';

export default {
  routeProps: {
    path: '/action_flows',
    component: ActionFlows
  },
  styleProps: {
    icon: <ForumIcon />
  },
  name: t => t('misc.action_flows'),
  featureName: 'Action Flows',
  accessibleBy: ['admin']
};
