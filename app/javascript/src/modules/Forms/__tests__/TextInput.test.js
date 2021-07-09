import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import TextInput from '../components/TextInput'

describe('TextInput component', () => {
  it('should not break the text input', () => {
    const props = {
        handleValue: jest.fn(),
        properties: { fieldName: 'Client Name', required: false },
        value: '',
        editable: true,
        id: '3145c47e'
    }
    const rendered = render(<TextInput {...props} />)
    const formField = rendered.queryByLabelText('text-input')
    expect(formField).toHaveTextContent('Client Name')
    expect(formField).toHaveTextContent('for admins only')
  })

  it('should not show the admin only editable is false', () => {
    const props = {
        handleValue: jest.fn(),
        properties: { fieldName: 'Client Name', required: false },
        value: '',
        editable: false,
        id: '3145c4247e'
    }
    const rendered = render(<TextInput {...props} />)
    const formField = rendered.queryByLabelText('text-input')
    expect(formField).toHaveTextContent('Client Name')
    expect(formField).not.toHaveTextContent('for admins only')
  })
})
