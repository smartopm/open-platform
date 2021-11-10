/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

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
      }
      attachments
    }
  }
`