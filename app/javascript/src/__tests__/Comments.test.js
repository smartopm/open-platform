import React from 'react'
import Comments, { CommentBox, CommentSection } from '../components/Discussion/Comment'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { CommentMutation } from '../graphql/mutations'

const commentBtn = jest.fn()
const props = {
    authState: { user: { imageUrl: "someimagesource" } },
    sendComment: commentBtn,
    data: {
        message: "I am a comment",
        isLoading: false
    },
    handleCommentChange: jest.fn()
}

describe('CommentBox', () => {

    it('should render with wrong props', () => {
        const container = render(<CommentBox {...props} />)
        expect(container.queryByText('Send')).toBeInTheDocument()

        const comment = container.queryByTestId('comment_content')
        fireEvent.change(comment, { target: { value: 'This is a good comment' } })
        expect(comment.value).toBe('This is a good comment')
    })
})


describe('CommentSection', () => {
    const props = {
        user: { name: "someimagesource" },
        createdAt: new Date(),
        comment: "This is another comment"
    }

    it('should render with wrong props', () => {
        const container = render(<CommentSection {...props} />)
        expect(container.queryByText('someimagesource')).toBeInTheDocument()
        expect(container.queryByText('This is another comment')).toBeInTheDocument()
    })
})