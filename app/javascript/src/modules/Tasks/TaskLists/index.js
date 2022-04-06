import React from 'react';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import TaskLists from './Components/TaskLists';

// TODO: Set the necessary permissions for task lists
const taskListPermissions = ['can_access_tasks']
const currentModule = 'note';

function RenderTaskLists() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={taskListPermissions}>
      <TaskLists />
    </AccessCheck>
  )
}

export default {
  routeProps: {
    path: '/tasks/task_lists',
    exact: true,
    component: RenderTaskLists
  },
  name: t => t ('menu.task_lists'),
  featureName: 'Task Lists',
  accessibleBy: [],
  moduleName: currentModule,
  styleProps: {
    className: 'task-lists-menu-item'
  },
  subRoutes: [ // TODO Add necessary sub routes
  ]
};
