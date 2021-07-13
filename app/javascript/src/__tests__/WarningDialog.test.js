import React from 'react'
import { render } from '@testing-library/react'
import { ActionDialog } from '../components/Dialog'
import '@testing-library/jest-dom/extend-expect'

const props = {
  open: true,
  handleClose: jest.fn(),
  handleOnSave: jest.fn(),
  message: 'Wait what are you doing!??'
}
describe('ActionDialog component', () => {
  it('should render necessary elements', () => {
    const container = render(<ActionDialog {...props} />)

    expect(
      container.queryByText('Wait what are you doing!??')
    ).toBeInTheDocument()
    expect(container.queryByText('menu.proceed')).toBeInTheDocument()
    expect(container.queryByText('form_actions.cancel')).toBeInTheDocument()
  })
})
