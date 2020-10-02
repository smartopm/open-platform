/* eslint-disable */
import React from 'react'
import CommentCard from '../components/Notes/CommentCard'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom/extend-expect'

describe('Contact page', () => {
  const deleteModal = jest.fn
  const data = {
    noteComments: [
      {
      id: 'jwhekw',
      body: 'whgeukhw',
      createdAt: "2020-09-30T20:32:17Z",
      user: {
        imageUrl: '',
        name: 'tolulope'
        }
      }
    ]
  }
  const authState = {
    loaded: true,
    loggedIn: true,
    setToken: jest.fn(),
    user: {
      avatarUrl: null
    }
  }

  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <CommentCard
            deleteModal={deleteModal}
            authState={authState.user}
            data={data}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
