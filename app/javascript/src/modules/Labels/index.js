import React from 'react'
import ForumIcon from '@mui/icons-material/Forum';
import Labels from './Containers/Labels';
import AccessCheck from '../Permissions/Components/AccessCheck';

const labelPermissions = ['can_fetch_all_labels'];
// const labelPermissions = ['can_sing'];
const currentModule = 'label';

function RenderLabels() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={labelPermissions}>
      <Labels />
    </AccessCheck>
  )
}

export default {
  routeProps: {
    path: '/labels',
    component: RenderLabels
  },
  styleProps: {
    icon: <ForumIcon />
  },
  name: t => t('misc.labels'),
  featureName: 'Labels',
  moduleName: currentModule,
  accessibleBy: []
};
