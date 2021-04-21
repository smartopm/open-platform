import Tasks from './containers/Todo';
import TaskReminder from './TaskReminder'
import TaskUpdate from './containers/TaskUpdate'

export default {
  routeProps: {
    path: '/tasks',
    exact: true,
    component: Tasks
  },
  name: 'Tasks',
  accessibleBy: ['admin'],
  subRoutes: [
    {
      routeProps: {
        path: '/tasks/:taskId',
        exact: true,
        component: TaskUpdate
      },
      name: 'Task Update',
      accessibleBy: ['admin']
    },
    {
      routeProps: {
        path: '/my_tasks',
        exact: true,
        component: Tasks
      },
      name: 'My Tasks',
      accessibleBy: ['admin']
    }
  ]
};

export { TaskReminder }