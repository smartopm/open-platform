import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskDelete from '../Components/TaskDelete'
import '@testing-library/jest-dom/extend-expect'
import { DeleteNoteComment } from '../../../graphql/mutations'

describe('Comment Delete Component', () => {
  const mocks = [
    {
      request: {
        query: DeleteNoteComment,
        variables: { id: 'jwhekw' },
      },
      result: { data: { noteCommentDelete: { commentDelete: true } } },
    },
  ];
  const handleClose = jest.fn
  const open = jest.fn
  const data = {
    id: 'jwhekw',
    body: 'whgeukhw',
    imageUrl: '',
    name: 'tolulope'
  }

  it('render without error', () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <TaskDelete
            id={data.id}
            body={data.body}
            imageUrl={data.imageUrl}
            name={data.name}
            open={open}
            handleClose={handleClose}
            refetch={jest.fn}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('Are you sure you want to delete your comment?')).toBeInTheDocument()
    fireEvent.click(container.queryByTestId('button'))
  })
})
