import gql from 'graphql-tag';
import { NotesFragment , TasksFragment } from '../../../../graphql/fragments';


export const ProcessesQuery = gql`
  query GetProcesses($offset: Int, $limit: Int, $query: String) {
    processes(offset: $offset, limit: $limit, query: $query) {
      ...NoteFields
      subTasks {
        ...NoteFields,
        subTasks {
          ...NoteFields
        }
      }
    }
  }
  ${NotesFragment.note}
`

export const ProjectsQuery = gql`
  query GetProjects($offset: Int, $limit: Int, $step: String, $completedPerQuarter: String, $submittedPerQuarter: String) {
    projects(offset: $offset, limit: $limit, step: $step, completedPerQuarter: $completedPerQuarter, submittedPerQuarter: $submittedPerQuarter) {
      ...TaskFields
      subTasks {
        id
        body
        completed
      }
    }
  }
  ${TasksFragment.task}
`

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
`

export const ProjectStagesQuery = gql`
  query projectStages {
    projectStages
  }
`

// TODO: olivier sync with Bonny to verify if this matches accordingly
export const TaskQuarterySummaryQuery = gql`
    query tasksByQuarter {
      tasksByQuarter
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
`
