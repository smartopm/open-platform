import React from 'react'
import ForumIcon from '@material-ui/icons/Forum';
import Labels from '../../containers/Label/Labels';

export default {
  routeProps: {
    path: '/labels',
    component: Labels
  },
  styleProps: {
    icon: <ForumIcon />
  },
  name: t => t('misc.labels'),
  accessibleBy: ['admin']
};
