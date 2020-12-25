import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import PaymentItem from '../../components/Payments/PaymentItem'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Invoice Item Component', () => {
  it('should render the invoice item component', () => {
    const paymentData = {
      id: 'hg73ye',
      user: {
        name: 'tolulope'
      },
      paymentType: 'cash',
      paymentStatus: 'settled',
      amount: 1000
    }
    const container = render(
      <BrowserRouter>
        <PaymentItem paymentData={paymentData} currency="k" />
      </BrowserRouter>
    )
    expect(container.queryByTestId('name').textContent).toContain('tolulope')
    expect(container.queryByTestId('type').textContent).toContain('cash')
    expect(container.queryByTestId('status').textContent).toContain('settled')
    expect(container.queryByTestId('amount').textContent).toContain('k1000')
  })
})
