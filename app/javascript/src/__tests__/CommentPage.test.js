import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { MockedProvider } from '@apollo/react-testing'
import CommentsPage from '../containers/Comments/CommentPage'
import '@testing-library/jest-dom/extend-expect'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Comments Page', () => {
  it('renders the comments page', async () => {
    const container = render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <CommentsPage />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('Comments')).toBeInTheDocument()
  })
})
