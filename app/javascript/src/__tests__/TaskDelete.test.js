/* eslint-disable */
import React from 'react'
import TaskDelete from '../components/Notes/TaskDelete'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom/extend-expect'

describe('Comment Delete Component', () => {
  const handleClose = jest.fn
  const open = jest.fn
  const data = {
    id: 'jwhekw',
    body: 'whgeukhw',
    imageUrl: '',
    name: 'tolulope'
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
          <TaskDelete
            authState={authState}
            id={data.id}
            body={data.body}
            imageUrl={data.imageUrl}
            name={data.name}
            open={open}
            handleClose={handleClose}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
