import React from 'react'
import { render } from '@testing-library/react'

import TextInput from '../../components/FormProperties/TextInput'

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
    expect(rendered.queryByText('errors.admins_only')).toBeInTheDocument()
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
    expect(rendered.queryByText('errors.admins_only')).not.toBeInTheDocument()
  })

  it('should show validation error message', () => {
    const props = {
        handleValue: jest.fn(),
        properties: { fieldName: 'Address', required: true },
        value: '',
        editable: false,
        id: '3145c4247e'
    }
    const rendered = render(<TextInput {...props} inputValidation={{error: true}} />)
    expect(rendered.queryByText('errors.required_field')).toBeInTheDocument()
  })
})
