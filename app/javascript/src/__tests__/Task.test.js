import React from 'react'
import { Task } from '../components/Notes/Task'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('component that centers divs', () => {
  it('should not render with wrong props', () => {
    const props = {
        note: {
            body: 'Note example',
            id: '23',
            author: {
                name: 'Johnsc'
            },
            user: {
                name: 'somebody'
            }
        },
        message: '',
        users: [],
        handleCompleteNote: jest.fn(),
        loaded: false,
        loading: false,
        classes: {},
        assignUnassignUser: jest.fn(),
        handleDelete: jest.fn(),
        handleModal: jest.fn(),
    }
    const container = render(<Task {...props} />)
    expect(container.queryByText('Note example')).toBeInTheDocument()
    expect(container.queryByText('Johnsc')).toBeInTheDocument()
    expect(container.queryByText('somebody')).toBeInTheDocument()
    expect(container.queryByText('Associated with somebody')).toBeInTheDocument()
  })
})

