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
      body
      createdAt
      id
      completed
      category
      description
      dueDate
      status
      user {
        id
        name
        imageUrl
      }
      assignees {
        id
        name
        imageUrl
        avatarUrl
        userType
      }
      assigneeNotes {
        id
        userId
        reminderTime
      }
      parentNote {
        id
        body
      subTasksCount
    }
  }
`;
