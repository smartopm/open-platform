import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { UserNote } from '../components/User/UserNote'

describe('user note component', () => {
  it('should render correct note details', () => {
    const props = {
        note: {
            body: 'Some note',
            createdAt: '08-08-2020',
            completed: false,
            id: '384dsd23',
            flagged: true
            
        },
        handleFlagNote: jest.fn()
    }
    const container = render(<UserNote {...props} />)
    expect(container.queryByText('Some note')).toBeInTheDocument()
    expect(container.queryByLabelText('Flag as a todo')).not.toBeDisabled()
  })
})
