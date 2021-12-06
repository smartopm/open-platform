import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Upload from '../../components/FormProperties/UploadField'

describe('Upload component', () => {
  it('should show the upload field', () => {
      const handler = jest.fn()
    const props = {
        upload: handler,
        detail: { status: '', type: 'file', label: 'Image Label', required: true },
        editable: false,
        uploaded: false
    }
    const container = render(<Upload {...props} />)
    const uploadBtn = container.queryByLabelText('upload_button_Image Label')
    const uploadField = container.queryByLabelText('upload_field_Image Label')
    expect(uploadBtn).not.toBeDisabled()
    fireEvent.change(uploadField)
    expect(handler).toHaveBeenCalled()
    expect(container.queryByText('form:misc.upload_file')).toBeInTheDocument()
    expect(container.queryByText('Image Label *')).toBeInTheDocument()
  })

  it('should show validation error message', () => {
    const handler = jest.fn()
    const props = {
        upload: handler,
        handleValue: jest.fn(),
        detail: { status: '', type: 'file', label: 'Image Label', required: true },
        editable: false
    }
    const rendered = render(<Upload {...props} inputValidation={{error: true}} />)
    expect(rendered.queryByText('form:errors.required_field')).toBeInTheDocument()
  })
})
