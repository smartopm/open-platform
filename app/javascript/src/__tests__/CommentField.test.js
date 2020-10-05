import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import CommentField from '../components/Notes/CommentField'
import '@testing-library/jest-dom/extend-expect'

describe('Comment Field Component', () => {
  const data = {
    task: {
      id: 'kjrk3rl3l',
      body: 'body',
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
          <CommentField
            authState={authState}
            data={data}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
