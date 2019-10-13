import gql from 'graphql-tag';
import {UserFragment} from './fragments';

export const UserQuery = gql`
query User($id: ID!) {
  user(id: $id) {
    ...UserFields
  }
}
${UserFragment.publicFields}
`;

