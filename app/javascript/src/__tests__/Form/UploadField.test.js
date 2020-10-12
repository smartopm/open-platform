import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Upload from '../../components/Forms/UploadField'

describe('Upload component', () => {
  it('should show the upload field', () => {
      const handler = jest.fn()
    const props = {
        upload: handler,
        status: ''
    }
    const container = render(<Upload {...props} />)
    const uploadBtn = container.queryByLabelText('upload_button')
    const uploadField = container.queryByLabelText('upload_field')
    // expect(uploadBtn).toHaveTextContent('Client Name')
    expect(uploadBtn).not.toBeDisabled()
    fireEvent.change(uploadField)
    expect(handler).toHaveBeenCalled()
    expect(container.queryByText('Upload File')).toBeInTheDocument()
  })
})
