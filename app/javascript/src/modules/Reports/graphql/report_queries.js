import gql from 'graphql-tag';

const FormSubmissionsQuery = gql`
  query formsSubmissions($formId: ID!, $startDate: String, $endDate: String) {
    formSubmissions(id: $formId, startDate: $startDate, endDate: $endDate) {
      id
      value
      fieldName
    }
  }
`;

export default FormSubmissionsQuery;
