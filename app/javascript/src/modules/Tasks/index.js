import Tasks from './containers/Todo';
import TaskReminder from './TaskReminder'
import TaskUpdate from './containers/TaskUpdate'
import { siteManagers } from '../../utils/constants';

export default {
  routeProps: {
    path: '/tasks',
    exact: true,
    component: Tasks
  },
  name: t => t('misc.tasks'),
  featureName: 'Tasks',
  accessibleBy: siteManagers,
  subRoutes: [
    {
      routeProps: {
        path: '/tasks/:taskId',
        exact: true,
        component: TaskUpdate
      },
      name: 'Task Update',
      accessibleBy: siteManagers
    },
    {
      routeProps: {
        path: '/my_tasks',
        exact: true,
        component: Tasks
      },
      name: 'My Tasks',
      accessibleBy: siteManagers
    }
  ]
};

export { TaskReminder }