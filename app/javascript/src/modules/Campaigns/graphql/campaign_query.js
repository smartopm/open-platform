import gql from 'graphql-tag';

export const SearchUserID = gql`
  query SearchUserId($query: String, $userIds: [Strings]) {
    searchUserIds(query: $query, userIds: $userIds) {
      id
      name
      imageUrl
      avatarUrl
    }
  }
`

export default SearchUserID 