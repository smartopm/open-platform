import gql from 'graphql-tag';

const EmailTemplatesMutation = gql`
  mutation createTemplate($name: String!, $subject: String!, $body: String!) {
    emailTemplateCreate(name: $name, subject: $subject, body: $body) {
      emailTemplate {
        id
      }
    }
  }
`;

export default EmailTemplatesMutation;
