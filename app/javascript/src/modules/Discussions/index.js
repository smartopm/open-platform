import React from 'react';
import Discussions from './Containers/Discussions';
import AccessCheck from '../Permissions/Components/AccessCheck';

const discussionPermissions = ['can_access_all_discussions'];
const currentModule = 'discussion';

function RenderDiscussions() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={discussionPermissions}>
      <Discussions />
    </AccessCheck>
  )
}

export default {
  routeProps: {
    path: '/discussions',
    exact: true,
    component: RenderDiscussions
  },
  name: t => t('misc.discussions'),
  featureName: 'Discussions',
  moduleName: currentModule,
  accessibleBy: []
};
