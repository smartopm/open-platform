import gql from 'graphql-tag';

const TaskListsQuery = gql`
  query TaskLists {
    taskLists {
      id
      name
    }
  }
`

export default TaskListsQuery;
