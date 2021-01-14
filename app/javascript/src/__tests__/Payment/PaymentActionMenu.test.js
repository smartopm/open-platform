import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import '@testing-library/jest-dom/extend-expect'
import PaymentActionMenu from '../../components/Payments/PaymentActionMenu'

describe('Payment Action Menu', () => {
  it('it should include payment action menu', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PaymentActionMenu />
        </BrowserRouter>
      </MockedProvider>)
    expect(container.queryByText('View')).toBeInTheDocument()
    expect(container.queryByText('Edit')).toBeInTheDocument()
    expect(container.queryByText('Cancel Invoice')).toBeInTheDocument()
  })
})