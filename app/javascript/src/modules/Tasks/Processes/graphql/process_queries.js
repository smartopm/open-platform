import gql from 'graphql-tag';
import { NotesFragment } from '../../../../graphql/fragments';

export const ProcessesQuery = gql`
  query GetProcesses($offset: Int, $limit: Int, $query: String) {
    processes(offset: $offset, limit: $limit, query: $query) {
      ...NoteFields
      subTasks {
        ...NoteFields
      }
    }
  }
  ${NotesFragment.note}
`

export const ProjectsQuery = gql`
  query GetProjects($offset: Int, $limit: Int) {
    projects(offset: $offset, limit: $limit) {
      ...NoteFields
      subTasks {
        ...NoteFields
      }
    }
  }
  ${NotesFragment.note}
`
export const ProjectStagesQuery = gql`
  query projectStages {
    projectStages
  }
`
