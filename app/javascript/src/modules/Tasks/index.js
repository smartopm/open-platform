import React from 'react';
import Tasks from './containers/Todo';
import TaskReminder from './TaskReminder';
import {siteManagers} from '../../utils/constants';
import AccessCheck from '../Permissions/Components/AccessCheck';
import TaskPageRedirect from './Components/TaskPageRedirect';
import TaskListsMenu from './TaskLists';

const tasksPermissions = ['can_access_tasks'];
const currentModule = 'note';

function RenderTaskUpdate() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={tasksPermissions}>
      <TaskPageRedirect />
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

const TasksMenu =  {
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
  styleProps: {
    className: 'tasks-sub-menu-item'
  },
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
  ]
};

export default {
  routeProps: {
    path: '/tasks',
    component: <span />,
  },
  styleProps: {
    className: 'tasks-menu-item'
  },
  name: (t) => t('misc.tasks'),
  featureName: 'Tasks',
  moduleName: 'note',
  accessibleBy: [],
  subMenu: [TasksMenu, TaskListsMenu],
};

export {TaskReminder};
