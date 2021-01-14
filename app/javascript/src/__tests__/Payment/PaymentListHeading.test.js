import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import '@testing-library/jest-dom/extend-expect'
import PaymentHeadingList from '../../components/Payments/PaymentListHeading'

describe('Payment Headings', () => {
  it('it should include payment heading', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PaymentHeadingList />
        </BrowserRouter>
      </MockedProvider>)
    expect(container.queryByText('Parcel Number')).toBeInTheDocument()
    expect(container.queryByText('Due Date')).toBeInTheDocument()
    expect(container.queryByText('Payment made by')).toBeInTheDocument()
  })
})
