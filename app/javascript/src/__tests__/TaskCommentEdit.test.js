/* eslint-disable */
import React from 'react'
import TaskCommentEdit from '../components/Notes/TaskCommentEdit'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom/extend-expect'

describe('Comment Edit Field Component', () => {
  const handleClose = jest.fn
  const data = {
    id: 'jwhekw',
    body: 'whgeukhw',
    createdAt: "2020-09-30T20:32:17Z",
    user: {
      imageUrl: '',
      name: 'tolulope'
      }
  }
  const authState = {
    user: {
      avatarUrl: null
    }
  }

  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <TaskCommentEdit
            authState={authState}
            data={data}
            handleClose={handleClose}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
