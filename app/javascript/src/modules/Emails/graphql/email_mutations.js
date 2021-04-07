// this should contain mutations for email templates
import gql from 'graphql-tag';

const EmailTemplatesMutation = gql`
  mutation createTemplate($name: String!, $subject: String!, $body: String!, $data: JSON!) {
    emailTemplateCreate(name: $name, subject: $subject, body: $body, data: $data) {
      emailTemplate {
        id
      }
    }
  }
`;

export default EmailTemplatesMutation;
