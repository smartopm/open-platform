import gql from 'graphql-tag';

const ProcessTemplatesQuery = gql`
query ProcessTemplates($offset: Int, $limit: Int) {
  processTemplates(offset: $offset, limit: $limit) {
   id
   name
   processType
   form {
     id
   }
   noteList {
     id
   }
  }
}
`

export const ProcessFormsQuery = gql`
  query ProcessFormsQuery {
    forms {
      id
      name
    }
  }
`

export const ProcessTaskListsQuery = gql`
  query ProcessTaskLists {
    processTaskLists {
      id
      name
    }
  }
`

export default ProcessTemplatesQuery