import gql from 'graphql-tag';

export const TaskListsQuery = gql`
  query TaskLists {
    taskLists {
      id
      body
      noteList {
        id
        name
      }
    }
  }
`;

export const TaskListQuery = gql`
  query taskListDetail($taskId: ID!) {
    taskList(taskId: $taskId) {
      id
      body
      subTasksCount
    }
  }
`;
