import React from 'react';
import Tasks from './containers/Todo';
import TaskReminder from './TaskReminder';
import TaskUpdate from './containers/TaskUpdate';
import {siteManagers} from '../../utils/constants';
import AccessCheck from '../Permissions/Components/AccessCheck';

const tasksPermissions = [
  'can_create_note',
  'can_get_task_count',
  'can_get_task_stats',
  'can_get_own_tasks',
  'can_fetch_task_histories',
  'can_fetch_task_comments',
  'can_fetch_flagged_notes',
];
const taskUpdatePermissions = [
  'can_update_note',
  'can_assign_note',
  'can_set_note_reminder',
  'can_create_note_comment',
  'can_update_note_comment',
  'can_bulk_assign_note',
  'can_fetch_task_comments',
  'can_fetch_task_by_id'
];

const currentModule = 'note'

function RenderTaskUpdate() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={taskUpdatePermissions}>
      <TaskUpdate />
    </AccessCheck>
)
}


function RenderTasks() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={tasksPermissions}>
      <Tasks />
    </AccessCheck>
)
}


export default {
  routeProps: {
    path: '/tasks',
    exact: true,
    component: RenderTasks
  },
  name: t => t ('misc.tasks'),
  featureName: 'Tasks',
  // To be deprecated in favour of wrapping in AccessCheck component that checks user permissions
  accessibleBy: [],
  moduleName: currentModule,
  subRoutes: [
    {
      routeProps: {
        path: '/tasks/:taskId',
        exact: true,
        component: RenderTaskUpdate
      },
      name: 'Task Update',
      accessibleBy: siteManagers,
    },
    {
      routeProps: {
        path: '/my_tasks',
        exact: true,
        component: RenderTasks
      },
      name: 'My Tasks',
      accessibleBy: siteManagers,
    },
  ],
};

export {TaskReminder};
