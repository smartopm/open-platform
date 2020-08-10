import React from 'react'
import { CommentBox, CommentSection } from '../components/Discussion/Comment'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

const commentBtn = jest.fn()
const props = {
    authState: { user: { imageUrl: "someimagesource" } },
    sendComment: commentBtn,
    data: {
        message: "I am a comment",
        isLoading: false
    },
    handleCommentChange: jest.fn(),
    upload: {
        handleFileUpload: jest.fn(),
        status: 'DONE',
        url: 'https://dev.dgdp.site/activestorage'
      }
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
    const props = {
        user: { name: "someimagesource" },
        createdAt: new Date(),
        comment: "This is another comment",
        imageUrl: 'https://dev.dgdp.site/activestorage'
    }

    it('should render with wrong props', () => {
        const container = render(
            <BrowserRouter>
                <CommentSection {...props} />
            </BrowserRouter>
        )
        expect(container.queryByText('someimagesource')).toBeInTheDocument()
        expect(container.queryByText('This is another comment')).toBeInTheDocument()
        expect(container.queryByAltText('image for This is another comment')).toBeInTheDocument()
    })
})