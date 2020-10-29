/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import { CommentBox, CommentSection } from '../components/Discussion/Comment'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

const commentBtn = jest.fn()
const props = {
  authState: { user: { imageUrl: 'someimagesource', userType: 'admin' } },
  sendComment: commentBtn,
  data: {
    message: 'I am a comment',
    isLoading: false
  },
  handleCommentChange: jest.fn(),
  upload: {
    handleFileUpload: jest.fn(),
    status: 'DONE',
    url: 'https://dev.dgdp.site/activestorage'
  },
}

describe('CommentBox', () => {
  it('should render with wrong props', () => {
    const container = render(
      <BrowserRouter>
        <CommentBox {...props} />
      </BrowserRouter>
    )
    // Todo: Use regex to match both Comment and Send to make sure it works well from message box
    expect(container.queryByText('Comment')).toBeInTheDocument()
    expect(container.queryByText('Image uploaded')).toBeInTheDocument()

    const comment = container.queryByTestId('comment_content')
    fireEvent.change(comment, { target: { value: 'This is a good comment' } })
    expect(comment.value).toBe('This is a good comment')
  })
})

describe('CommentSection', () => {
  const commentsProps = {
    data: {
        user: { name: 'someimagesource' },
        comment: 'This is another comment',
        imageUrl: 'https://dev.dgdp.site/activestorage',
        isAdmin: true,
        createdAt: "2020-08-08"
    },
    handleDeleteComment: jest.fn(),
}
  it('should render with wrong props', () => {
    const container = render(
      <BrowserRouter>
        <CommentSection {...commentsProps} />
      </BrowserRouter>
    )
    expect(container.queryByText('someimagesource')).toBeInTheDocument()
    expect(container.queryByText('This is another comment')).toBeInTheDocument()
    // TODO: Olivier to fix this
    // expect(
    //   container.queryByAltText('This is another comment')
    // ).toBeInTheDocument()
    expect(container.queryByTestId('delete_icon')).toBeInTheDocument()
    expect(container.queryByTestId('delete_icon').textContent).toContain('2020-08-08')
  })
})
