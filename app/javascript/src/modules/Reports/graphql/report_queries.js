import gql from 'graphql-tag';

const FormSubmissionsQuery = gql`
  query formsSubmissions($startDate: String!, $endDate: String!) {
    formSubmissions(startDate: $startDate, endDate: $endDate) {
      id
      value
      order
      fieldName
      fieldType
    }
  }
`;

export default FormSubmissionsQuery;
