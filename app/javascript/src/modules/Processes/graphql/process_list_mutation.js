import gql from 'graphql-tag'

export const ProcessCreateMutation = gql`
  mutation ProcessCreateMutation($name: String!, $formId: ID!, $noteListId: ID!) {
    processCreate(
      name: $name
      formId: $formId
      noteListId: $noteListId
    ) {
      success
    }
  }
`;

export const ProcessUpdateMutation = gql`
  mutation processUpdateMutation($id: ID!, $name: String, $formId: ID, $noteListId: ID, $process_type: String) {
    processUpdate(id: $id, name: $name, formId: $formId, noteListId: $noteListId, processType: $process_type) {
      process {
        id
        name
        form {
          id
        }
        noteList {
          id
        }
      }
    }
  }
`
export const ProcessDeleteMutation = gql`
  mutation processDeleteMutation($id: ID!) {
    processDelete(id: $id){
      success
    }
  }
`
