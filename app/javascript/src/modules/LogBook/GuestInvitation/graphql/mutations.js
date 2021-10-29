import gql from 'graphql-tag'
import { EntryRequestFragment } from '../../../../graphql/fragments'


const GuestEntryRequestRevoke = gql`
  mutation GuestEntryRequestRevokeMutation($id: ID!) {
    result: guestEntryRequestRevoke(id: $id) {
      entryRequest {
        ...EntryRequestFields
      }
    }
  }
  ${EntryRequestFragment.publicFields}
`
export default GuestEntryRequestRevoke;