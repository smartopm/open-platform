import Tasks from '../../containers/Todo';
import TaskReminder from './TaskReminder'

export default {
  routeProps: {
    path: '/tasks',
    component: Tasks
  },
  name: 'Tasks',
  accessibleBy: ['admin']
};

export { TaskReminder }