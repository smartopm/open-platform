import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'

import ActionMenu from '../../modules/Payments/Components/PaymentActionMenu'

describe('Payment Action Menu', () => {
  it('should include payment action menu', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <ActionMenu open handleClose={jest.fn()} anchorEl={document.createElement("button")}>
            <div>View</div>
          </ActionMenu>
        </BrowserRouter>
      </MockedProvider>)
    expect(container.queryByText('View')).toBeInTheDocument()
  })
})