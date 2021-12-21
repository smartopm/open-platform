import gql from 'graphql-tag';
import { NotesFragment } from '../../../../graphql/fragments';

// eslint-disable-next-line import/prefer-default-export
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
