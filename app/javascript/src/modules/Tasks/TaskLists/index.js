import React from 'react';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import TaskLists from './Components/TaskLists';
import TaskListConfigure from './Components/TaskListConfigure';
import AddSubTasks from './Components/AddSubTasks';

const taskListPermissions = ['can_view_task_lists'];
const currentModule = 'task_list';

export function RenderTaskLists() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={taskListPermissions}>
      <TaskLists />
    </AccessCheck>
  );
}

export function RenderTaskListConfigure() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={taskListPermissions}>
      <TaskListConfigure />
    </AccessCheck>
  );
}

export function RenderAddSubTasks() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={taskListPermissions}>
      <AddSubTasks />
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
        component: RenderTaskListConfigure
      },
      name: 'Task List Create ',
      accessibleBy: []
    },
    {
      routeProps: {
        path: '/tasks/task_lists/:taskId',
        exact: true,
        component: RenderAddSubTasks
      },
      name: 'Task List Sub Task',
      accessibleBy: []
    }
  ]
};
