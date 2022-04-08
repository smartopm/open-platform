import gql from 'graphql-tag';
import { TasksFragment } from '../../../../graphql/fragments';

const TaskListsQuery = gql`
  query TaskLists {
    taskLists {
      ...TaskFields
    }
  }
  ${TasksFragment.task}
`

export default TaskListsQuery;
