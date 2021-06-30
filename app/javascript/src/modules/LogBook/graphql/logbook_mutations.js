import gql from 'graphql-tag';

const AddObservationNoteMutation = gql`
  mutation addObservationNote($id: ID!, $note: String) {
    entryRequestNote(id: $id, note: $note) {
      event {
        id
      }
    }
  }
`;
export default AddObservationNoteMutation;
