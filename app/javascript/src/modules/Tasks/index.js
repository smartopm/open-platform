import Tasks from './containers/Todo';
import TaskReminder from './TaskReminder'
import TaskUpdate from './containers/TaskUpdate'

export default {
  routeProps: {
    path: '/tasks',
    exact: true,
    component: Tasks
  },
  name: t => t('misc.tasks'),
  enabled: enabled => !!enabled,
  featureName: 'Tasks',
  accessibleBy: ['admin'],
  subRoutes: [
    {
      routeProps: {
        path: '/tasks/:taskId',
        exact: true,
        component: TaskUpdate
      },
      name: 'Task Update',
      enabled: enabled => !!enabled,
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/my_tasks',
        exact: true,
        component: Tasks
      },
      name: 'My Tasks',
      enabled: enabled => !!enabled,
      accessibleBy: ['admin']
    }
  ]
};

export { TaskReminder }