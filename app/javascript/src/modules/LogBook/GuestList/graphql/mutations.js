import gql from 'graphql-tag'
import { EntryRequestFragment } from '../../../../graphql/fragments'


const GuestEntryRequestRevoke = gql`
  mutation GuestEntryRequestRevokeMutation($id: ID!, $userId: ID!) {
    result: guestEntryRequestRevoke(id: $id, userId: $userId) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`
export default GuestEntryRequestRevoke;