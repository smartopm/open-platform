import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import CommentCard from '../modules/Tasks/Components/CommentCard'
import '@testing-library/jest-dom/extend-expect'

describe('Comment Card Component', () => {
  const data = {
    taskComments: [
      {
      id: 'jwhekw',
      body: 'body',
      createdAt: "2020-09-30T20:32:17Z",
      user: {
        imageUrl: '',
        name: 'name'
        }
      }
    ]
  }

  it('render without error', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CommentCard
            data={data}
            refetch={jest.fn}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.getByTestId('comment-body')).toBeInTheDocument();
    fireEvent.click(container.getByTestId('more_details'))
    const edit = container.queryByTestId('edit')
    const deleteButton = container.queryByTestId('delete')
    expect(edit).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(edit)
    const cancel = container.queryByTestId('cancel')
    expect(cancel).toBeInTheDocument();
    fireEvent.click(cancel)
    expect(cancel).not.toBeInTheDocument();

    fireEvent.click(container.queryByTestId('delete'))
    expect(container.queryByText('task.delete_confirmation_text')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('cancel-delete'))
    expect(container.queryByText('task.delete_confirmation_text')).not.toBeInTheDocument();
  })
})
