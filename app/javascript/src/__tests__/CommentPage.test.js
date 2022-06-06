import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { MockedProvider } from '@apollo/react-testing'
import CommentsPage from '../containers/Comments/CommentPage'


describe('Comments Page', () => {
  it('renders the comments page', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <CommentsPage />
        </BrowserRouter>
      </MockedProvider>
    )
    await waitFor(() => expect(screen.queryByTestId('loader')).toBeInTheDocument());
  })
})
