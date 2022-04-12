import React from 'react';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import TaskLists from './Components/TaskLists';
import TaskListCreate from './Components/TaskListCreate';

const taskListPermissions = ['can_view_task_lists'];
const currentModule = 'note';

function RenderTaskLists() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={taskListPermissions}>
      <TaskLists />
    </AccessCheck>
  );
}

function RenderTaskListCreate() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={taskListPermissions}>
      <TaskListCreate />
    </AccessCheck>
  );
}

export default {
  routeProps: {
    path: '/tasks/task_lists',
    exact: true,
    component: RenderTaskLists
  },
  name: t => t('menu.task_lists'),
  featureName: 'Task Lists',
  accessibleBy: [],
  moduleName: currentModule,
  styleProps: {
    className: 'task-lists-sub-menu-item'
  },
  subRoutes: [
    {
      routeProps: {
        path: '/tasks/task_lists/new',
        exact: true,
        component: RenderTaskListCreate
      },
      name: 'Task List Create ',
      accessibleBy: []
    }
  ]
};
