import React from 'react'
import ForumIcon from '@material-ui/icons/Forum';
import Labels from './Containers/Labels';

export default {
  routeProps: {
    path: '/labels',
    component: Labels
  },
  styleProps: {
    icon: <ForumIcon />
  },
  name: t => t('misc.labels'),
  featureName: 'Labels',
  accessibleBy: ['admin']
};
