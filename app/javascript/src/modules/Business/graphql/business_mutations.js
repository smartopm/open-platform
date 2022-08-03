import gql from 'graphql-tag';

export const DeleteBusiness = gql`
  mutation DeleteBusiness($id: ID!) {
    businessDelete(id: $id) {
      businessDelete
    }
  }
`;

export const BusinessCreateMutation = gql`
mutation businessCreate($name: String!, $email: String!, $phoneNumber: String!, $status: String, $userId: ID!, $imageUrl: String, $operationHours: String, $description: String, $links: String, $homeUrl: String, $category: String, $address: String) {
  businessCreate(name: $name, email: $email, phoneNumber: $phoneNumber, status: $status, userId: $userId, imageUrl: $imageUrl, links: $links, category: $category, operationHours: $operationHours, description: $description, homeUrl: $homeUrl, address: $address) {
    business {
      id
    }
  }
}
`
export const BusinessUpdateMutation = gql`
mutation businessUpdate($id: ID!, $name: String!, $email: String!, $phoneNumber: String!, $status: String, $userId: ID!, $imageUrl: String, $operationHours: String, $description: String, $links: String, $homeUrl: String, $category: String, $address: String) {
  businessUpdate(id: $id, name: $name, email: $email, phoneNumber: $phoneNumber, status: $status, userId: $userId, imageUrl: $imageUrl, links: $links, category: $category, operationHours: $operationHours, description: $description, homeUrl: $homeUrl, address: $address) {
    business {
      id
    }
  }
}
`