/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';
import { NotesFragment, TasksFragment } from '../../../graphql/fragments';

export const TaskStatsQuery = gql`
  {
    taskStats {
      completedTasks
      tasksDueIn10Days
      tasksDueIn30Days
      tasksOpen
      tasksOpenAndOverdue
      overdueTasks
      tasksWithNoDueDate
      myOpenTasks
      totalCallsOpen
      totalFormsOpen
    }
  }
`;

export const TaskQuery = gql`
  query taskDetail($taskId: ID!) {
    task(taskId: $taskId) {
      body
      createdAt
      id
      completed
      category
      description
      dueDate
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
      }
      assigneeNotes{
        id
        userId
        reminderTime
      }
      parentNote {
        id
        body
        formUserId
      }
      attachments
      formUserId
    }
  }
`
export const SubTasksQuery = gql`
  query subTasks($taskId: ID!, $offset: Int, $limit: Int) {
    taskSubTasks(taskId: $taskId, offset: $offset, limit: $limit) {
      ...TaskFields
      subTasks {
        ...TaskFields
      }
    }
  }
  ${TasksFragment.task}
`

export const ProjectOpenTasksQuery = gql`
  query projectOpenTasks($taskId: ID!, $offset: Int, $limit: Int) {
    projectOpenTasks(taskId: $taskId, offset: $offset, limit: $limit) {
      ...NoteFields
    }
  }
  ${NotesFragment.note}
`


/**
 * @deprecated
 */
export const flaggedNotes = gql`
  query GetTodos($offset: Int, $limit: Int, $query: String) {
    flaggedNotes(offset: $offset, limit: $limit, query: $query) {
      ...NoteFields
      subTasks {
        ...NoteFields
      }
    }
  }
  ${NotesFragment.note}
`

export const TasksLiteQuery = gql`
  query tasksListQuery($offset: Int, $limit: Int, $query: String) {
    flaggedNotes(offset: $offset, limit: $limit, query: $query) {
      ...TaskFields
    }
  }
  ${TasksFragment.task}
`


export const TaskDocumentsQuery = gql`
  query taskDetail($taskId: ID!) {
    task(taskId: $taskId) {
      id
      attachments
    }
  }
`
