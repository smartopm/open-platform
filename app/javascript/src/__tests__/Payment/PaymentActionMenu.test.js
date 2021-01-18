import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import '@testing-library/jest-dom/extend-expect'
import ActionMenu from '../../components/Payments/PaymentActionMenu'

describe('Payment Action Menu', () => {
  it('it should include payment action menu', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <ActionMenu>
            <div>View</div>
          </ActionMenu>
        </BrowserRouter>
      </MockedProvider>)
    expect(container.queryByText('View')).toBeInTheDocument()
  })
})