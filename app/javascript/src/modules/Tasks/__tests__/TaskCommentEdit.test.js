import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import ReactTestUtils from "react-dom/test-utils";

import TaskCommentEdit from '../Components/TaskCommentEdit'
import { TaskCommentUpdate } from '../../../graphql/mutations'

describe('Comment Edit Field Component', () => {
  const mocks = [
    {
      request: {
        query: TaskCommentUpdate,
        variables: { id: 'jwhekw', body: 'new body' },
      },
      result: { data: { noteCommentUpdate: { noteComment: { body: 'body' } } } },
    },
  ];
  const handleClose = jest.fn
  const data = {
    id: 'jwhekw',
    body: 'whgeukhw',
    createdAt: "2020-09-30T20:32:17Z",
    user: {
      imageUrl: '',
      name: 'name'
    }
  }

  it('render without error', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <TaskCommentEdit
            refetch={jest.fn}
            data={data}
            handleClose={handleClose}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    await waitFor(() => {
      const body = container.queryByTestId('body_input')
      const commentButton = container.queryByTestId('button')
      expect(body).toBeInTheDocument();
      expect(commentButton).toBeInTheDocument();
    
      ReactTestUtils.Simulate.change(body, { target: { value: "new body" } });
      expect(body.value).toBe('new body')
      fireEvent.click(commentButton)
    }, 10)

  })

  it('render with error', async () => {
    const errorMocks = [
      {
        request: {
          query: TaskCommentUpdate,
          variables: { id: '', body: '' },
        },
        result: { data: { noteCommentUpdate: { noteComment: { body: 'body' } } } },
      },
    ];
    const container = render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <BrowserRouter>
          <TaskCommentEdit
            refetch={jest.fn}
            data={data}
            handleClose={handleClose}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    await waitFor(() => {
      const body = container.queryByTestId('body_input')
      const commentButton = container.queryByTestId('button')
      expect(body).toBeInTheDocument();
      expect(commentButton).toBeInTheDocument();
    
      ReactTestUtils.Simulate.change(body, { target: { value: "new body" } });
      expect(body.value).toBe('new body')
      fireEvent.click(commentButton)
    }, 10)
  })
})
