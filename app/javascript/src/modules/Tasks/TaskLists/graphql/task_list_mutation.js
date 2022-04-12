/* eslint-disable */
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
