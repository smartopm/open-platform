import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import CommentCard from '../components/Notes/CommentCard'
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
    
    expect(container.queryByText('name')).toBeInTheDocument();
    expect(container.queryByText('body')).toBeInTheDocument();
    const edit = container.queryByTestId('edit')
    const deleteButton = container.queryByTestId('deleteButton')
    expect(edit).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    
    fireEvent.click(edit)
    const cancel = container.queryByTestId('cancel')
    expect(cancel).toBeInTheDocument();
    fireEvent.click(cancel)
    expect(cancel).not.toBeInTheDocument();

    fireEvent.click(container.queryByTestId('deleteButton'))
    expect(container.queryByText('Are you sure you want to delete your comment?')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('cancel-delete'))
    expect(container.queryByText('Are you sure you want to delete your comment?')).not.toBeInTheDocument();
  })
})
