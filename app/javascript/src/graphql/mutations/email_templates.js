import gql from 'graphql-tag'

export default gql`
    mutation createTemplate($name: String!, $subject: String!, $body: String!) {
        emailTemplateCreate( name: $name, subject: $subject, body: $body){
        emailTemplate {
            id
            }
        }
    }
`
