import React from 'react'
import { render } from '@testing-library/react'
import { ActionDialog } from '../components/Dialog'

import MockedThemeProvider from '../modules/__mocks__/mock_theme';

const props = {
  open: true,
  handleClose: jest.fn(),
  handleOnSave: jest.fn(),
  message: 'Wait what are you doing!??'
}
describe('ActionDialog component', () => {
  it('should render necessary elements', () => {
    const container = render(<MockedThemeProvider><ActionDialog {...props} /></MockedThemeProvider>)

    expect(
      container.queryByText('Wait what are you doing!??')
    ).toBeInTheDocument()
    expect(container.queryByText('menu.proceed')).toBeInTheDocument()
    expect(container.queryByText('form_actions.cancel')).toBeInTheDocument()
  })
})
