import gql from 'graphql-tag';
import { TasksFragment } from '../../../../graphql/fragments';

export const TaskListsQuery = gql`
  query TaskLists {
    taskLists {
      ...TaskFields
    }
  }
  ${TasksFragment.task}
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
        formUserId
        assignees {
          id
        }
      }
      attachments
      formUserId
      subTasksCount
      formUser {
        id
        user {
          id
          name
        }
      }
    }
  }
`;
