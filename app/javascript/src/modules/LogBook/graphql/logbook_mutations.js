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


export const EntryRequestUpdateMutation = gql`
  mutation EntryRequestUpdateMutation(
    $id: ID!
    $name: String!
    $reason: String
    $vehiclePlate: String
    $nrc: String
    $otherReason: String
    $phoneNumber: String
    $visitationDate: String
    $startTime: String
    $endTime: String
    $companyName: String
    $temperature: String
    $occursOn: [String!]
    $visitEndDate: String
  ) {
    result: entryRequestUpdate(
      id: $id
      name: $name
      reason: $reason
      vehiclePlate: $vehiclePlate
      nrc: $nrc
      otherReason: $otherReason
      phoneNumber: $phoneNumber
      visitationDate: $visitationDate
      startTime: $startTime
      endTime: $endTime
      companyName: $companyName
      temperature: $temperature
      occursOn: $occursOn
      visitEndDate: $visitEndDate
    ) {
      entryRequest {
        id
      }
    }
  }
`