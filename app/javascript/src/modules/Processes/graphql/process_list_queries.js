import gql from 'graphql-tag';

export const ProcessTemplatesQuery = gql`
query ProcessTemplates($offset: Int, $limit: Int) {
  processTemplates(offset: $offset, limit: $limit) {
   id
   name
   form {
     id
   }
   noteList {
     id
   }
  }
}
`