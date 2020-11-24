import React from 'react'
import { render } from '@testing-library/react'
import { WarningDialog } from '../components/Dialog'
import '@testing-library/jest-dom/extend-expect'

const props = {
  open: true,
  handleClose: jest.fn(),
  handleOnSave: jest.fn(),
  message: 'Wait what are you doing!??'
}
describe('WarningDialog component', () => {
  it('should render necessary elements', () => {
    const container = render(<WarningDialog {...props} />)

    expect(
      container.queryByText('Wait what are you doing!??')
    ).toBeInTheDocument()
    expect(container.queryByText('Proceed')).toBeInTheDocument()
    expect(container.queryByText('Cancel')).toBeInTheDocument()
  })
})
