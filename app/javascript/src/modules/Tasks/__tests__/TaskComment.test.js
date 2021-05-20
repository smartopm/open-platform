import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskComment from '../Components/TaskComment'
import '@testing-library/jest-dom/extend-expect'
import { CommentQuery } from '../../../graphql/queries';

describe('Task Comment Component', () => {
  const taskComments = [
    {
      id: '50da896a-9217-43b9-a28f-03a13c7d401f',
      body: 'body',
      createdAt: '2020-12-28T22:00:00Z',
      user: {
        id: '50da896a-9217-43b9-a28f-03a13c7d401f',
        name: 'name',
        imageUrl: 'image.jpg'
      }
    }
  ]

  const commentMock = [
    {
      request: {
        query: CommentQuery,
        variables: { taskId: '50da896a-9217-43b9-a28f-03a13c7d401f' }
      },
      result: {
        data: {
          taskComments
        }
      }
    }
  ];
  const authState = {
    user: {
      avatarUrl: null
    }
  }

  it('render without error', () => {
    const container = render(
      <MockedProvider mocks={commentMock} addTypename={false}>
        <BrowserRouter>
          <TaskComment
            authState={authState}
            taskId='50da896a-9217-43b9-a28f-03a13c7d401f'
          />
        </BrowserRouter>
      </MockedProvider>
    )
    const commentClick = container.queryByTestId('comment')
    expect(commentClick).toBeInTheDocument();

    fireEvent.click(commentClick)
    expect(container.queryByTestId('hide_comment')).toBeInTheDocument();
  })
})
