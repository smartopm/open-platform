import gql from 'graphql-tag';

const FormSubmissionsQuery = gql`
  query formsSubmissions($formId: ID!) {
    formSubmissions(id: $formId) {
      id
      value
      fieldName
    }
  }
`;

export default FormSubmissionsQuery;
