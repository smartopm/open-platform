import gql from 'graphql-tag';

const AddObservationNoteMutation = gql`
  mutation addObservationNote($id: ID, $note: String, $refType: String, $eventLogId: ID) {
    entryRequestNote(id: $id, note: $note, refType: $refType, eventLogId: $eventLogId) {
      event {
        id
      }
    }
  }
`;
export default AddObservationNoteMutation;
