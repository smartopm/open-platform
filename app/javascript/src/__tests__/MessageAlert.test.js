import React from 'react'
import { render } from '@testing-library/react'
import MessageAlert from '../components/MessageAlert'


describe('MessageAlert component', () => {
  it("should render alert message", () => {
    const props = {
      type: 'success',
      message: 'Changes saved successfully',
      open: true,
      handleClose: jest.fn()
    }

    const rendered = render(<MessageAlert {...props} />)

    expect(rendered.queryByText('Changes saved successfully')).toBeInTheDocument()
  })
})
