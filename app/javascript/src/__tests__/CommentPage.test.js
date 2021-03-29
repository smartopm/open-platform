import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { MockedProvider } from '@apollo/react-testing'
import CommentsPage from '../containers/Comments/CommentPage'
import '@testing-library/jest-dom/extend-expect'

describe('Comments Page', () => {
  it('renders the comments page', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <CommentsPage />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
