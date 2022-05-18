import gql from 'graphql-tag';
import { NotesFragment, TasksFragment } from '../../../../graphql/fragments';

export const ProcessesQuery = gql`
  query GetProcesses($offset: Int, $limit: Int, $query: String) {
    processes(offset: $offset, limit: $limit, query: $query) {
      ...NoteFields
      subTasks {
        ...NoteFields
        subTasks {
          ...NoteFields
        }
      }
    }
  }
  ${NotesFragment.note}
`;

export const ProjectsQuery = gql`
  query GetProjects(
    $processName: String!
    $offset: Int
    $limit: Int
    $step: String
    $completedPerQuarter: String
    $submittedPerQuarter: String
    $lifeTimeCategory: String
    $repliesRequestedStatus: String
  ) {
    projects(
      processName: $processName
      offset: $offset
      limit: $limit
      step: $step
      completedPerQuarter: $completedPerQuarter
      submittedPerQuarter: $submittedPerQuarter
      lifeTimeCategory: $lifeTimeCategory
      repliesRequestedStatus: $repliesRequestedStatus
    ) {
      ...TaskFields
    }
  }
  ${TasksFragment.task}
`;

export const ProjectQuery = gql`
  query Project($formUserId: ID!) {
    project(formUserId: $formUserId) {
      id
      body
      subTasksCount
    }
  }
`;

export const ClientAssignedProjectsQuery = gql`
  query GetClientAssignedProjects($offset: Int, $limit: Int) {
    clientAssignedProjects(offset: $offset, limit: $limit) {
      ...TaskFields
      subTasks {
        ...TaskFields
      }
    }
  }
  ${TasksFragment.task}
`;

export const ProjectStagesQuery = gql`
  query projectStages {
    projectStages
  }
`;

export const TaskQuarterySummaryQuery = gql`
  query tasksByQuarter($processName: String!) {
    tasksByQuarter(processName: $processName)
  }
`;

export const ProjectCommentsQuery = gql`
  query GetProjectComments($taskId: ID!, $limit: Int, $offset: Int) {
    projectComments(taskId: $taskId, limit: $limit, offset: $offset) {
      id
      body
      createdAt
      user {
        id
        name
        imageUrl
      }
      repliedAt
      replyFrom {
        id
        name
      }
      replyRequired
      groupingId
      noteId
    }
  }
`;

export const ProjectsStatsQuery = gql`
  query GetProjectsStatsQuery(
    $processName: String!
    $offset: Int
    $limit: Int
    $step: String
    $completedPerQuarter: String
    $submittedPerQuarter: String
  ) {
    projects(
      processName: $processName
      offset: $offset
      limit: $limit
      step: $step
      completedPerQuarter: $completedPerQuarter
      submittedPerQuarter: $submittedPerQuarter
    ) {
      ...TaskFields
      subTasks {
        id
        body
        completed
      }
    }
  }
  ${TasksFragment.task}
`;

export const ReplyCommentStatQuery = gql`
  query replyCommentStats($processName: String!) {
    replyCommentStats(processName: $processName) {
      sent
      received
      resolved
    }
  }
`;

export const ProjectRepliesRequestedComments = gql`
  query repliesRequestedComments($taskId: ID!) {
    repliesRequestedComments(taskId: $taskId) {
      sent {
        id
        body
        createdAt
        groupingId
        user {
          id
          name
          imageUrl
        }
        replyFrom {
          id
          name
        }
        note {
          id
          body
        }
      }
      received {
        id
        body
        createdAt
        groupingId
        user {
          id
          name
          imageUrl
        }
        note {
          id
          body
        }
      }
      resolved {
        id
        body
        createdAt
        groupingId
        user {
          id
          name
          imageUrl
        }
        note {
          id
          body
        }
      }
      others {
        id
        body
        createdAt
        user {
          id
          name
          imageUrl
        }
        note {
          id
          body
        }
      }
    }
  }
`;

export const ProcessReplyComments = gql`
  query processReplyComments($processName: String!) {
    processReplyComments(processName: $processName) {
      sent {
        id
        body
        createdAt
        groupingId
        user {
          id
          name
          imageUrl
        }
        replyFrom {
          id
          name
        }
        note {
          id
          body
        }
      }
      received {
        id
        body
        createdAt
        groupingId
        user {
          id
          name
          imageUrl
        }
        note {
          id
          body
        }
      }
      resolved {
        id
        body
        createdAt
        groupingId
        user {
          id
          name
          imageUrl
        }
        note {
          id
          body
        }
      }
    }
  }
`;

export const ProjectStages = gql`
  query projectStages($processName: String!) {
    projectStages(processName: $processName)
    {
      id
      body
    }
  }
`;
