import gql from 'graphql-tag';

const AddObservationNoteMutation = gql`
  mutation addObservationNote($id: ID!, $note: String, $refType: String!) {
    entryRequestNote(id: $id, note: $note, refType: $refType) {
      event {
        id
      }
    }
  }
`;
export default AddObservationNoteMutation;
