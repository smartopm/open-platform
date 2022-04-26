import gql from 'graphql-tag';

export const CreateTaskList = gql`
  mutation taskListCreate($body: String!) {
    taskListCreate(body: $body) {
      note {
        id
        body
      }
    }
  }
`;

export const UpdateTaskList = gql`
  mutation noteListUpdate($id: ID!, $name: String) {
    noteListUpdate(id: $id, name: $name) {
      noteList {
        name
      }
    }
  }
`
