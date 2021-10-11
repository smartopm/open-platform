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

function taskUpdate() {
  <AccessCheck module={currentModule} allowedPermissions={taskUpdatePermissions}>
    <TaskUpdate />
  </AccessCheck>
}


function tasks() {
  <AccessCheck module={currentModule} allowedPermissions={tasksPermissions}>
    <Tasks />
  </AccessCheck>
}


export default {
  routeProps: {
    path: '/tasks',
    exact: true,
    render: tasks
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
        render: taskUpdate
      },
      name: 'Task Update',
      accessibleBy: siteManagers,
    },
    {
      routeProps: {
        path: '/my_tasks',
        exact: true,
        render: tasks
      },
      name: 'My Tasks',
      accessibleBy: siteManagers,
    },
  ],
};

export {TaskReminder};
