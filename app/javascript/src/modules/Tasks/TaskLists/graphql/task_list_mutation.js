import gql from 'graphql-tag';

export const CreateTaskList = gql`
  mutation taskListCreate($body: String!) {
    taskListCreate(body: $body) {
      note {
        id
        body
        dueDate
        progress
        subTasksCount
        taskCommentsCount
        taskCommentReply
        order
        completed
        status
        attachments
        formUserId
        submittedBy {
          id
          name
        }
        assignees {
          id
          name
          imageUrl
          avatarUrl
        }
      }
    }
  }
`;

export const UpdateTaskList = gql`
  mutation noteListUpdate($id: ID!, $name: String) {
    noteListUpdate(id: $id, name: $name) {
      noteList {
        name
      }
    }
  }
`
