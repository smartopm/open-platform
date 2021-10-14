import gql from 'graphql-tag';

const AddObservationNoteMutation = gql`
  mutation addObservationNote($id: ID, $note: String, $refType: String, $eventLogId: ID, $attachedImages: JSON) {
    entryRequestNote(id: $id, note: $note, refType: $refType, eventLogId: $eventLogId, attachedImages: $attachedImages) {
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
    $name: String
    $email: String
    $reason: String
    $vehiclePlate: String
    $nrc: String
    $otherReason: String
    $phoneNumber: String
    $visitationDate: String
    $startsAt: String
    $endsAt: String
    $companyName: String
    $temperature: String
    $occursOn: [String!]
    $visitEndDate: String
    $videoBlobId: String
  ) {
    result: entryRequestUpdate(
      id: $id
      name: $name
      email: $email
      reason: $reason
      vehiclePlate: $vehiclePlate
      nrc: $nrc
      otherReason: $otherReason
      phoneNumber: $phoneNumber
      visitationDate: $visitationDate
      startsAt: $startsAt
      endsAt: $endsAt
      companyName: $companyName
      temperature: $temperature
      occursOn: $occursOn
      visitEndDate: $visitEndDate
      videoBlobId: $videoBlobId
    ) {
      entryRequest {
        id
        isGuest
        videoUrl
      }
    }
  }
`;

export const SendGuestQrCodeMutation = gql`
  mutation SendGuestQrCodeMutation($id: ID!, $guestEmail: String!) {
    result: sendGuestQrCode(id: $id, guestEmail: $guestEmail) {
      message
    }
  }
`;
