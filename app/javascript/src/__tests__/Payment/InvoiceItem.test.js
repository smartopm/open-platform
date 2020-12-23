import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import InvoiceItem from '../../components/Payments/InvoiceItem'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Invoice Item Component', () => {
  it('should render the invoice item component', () => {
    const invoiceMock = {
      description: 'Invoice for a plot at Nkwashi',
      amount: 200,
      dueDate: '2020-09-12',
      status: 'in_progress',
      landParcel: {
        parcelNumber: 'Plot-123'
      }
    }
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <InvoiceItem invoice={invoiceMock} userType="client" />
        </MockedProvider>
      </BrowserRouter>)
    // shows the invoice status when user is not admin 
    expect(container.queryByTestId('amount').textContent).toContain('Invoice amount: k200')
    expect(container.queryByTestId('duedate').textContent).toContain('Due at: 2020-09-12')
    expect(container.queryByTestId('landparcel').textContent).toContain('Parcel number: Plot-123')
    expect(container.queryByTestId('pay-button')).toBeNull()
    expect(container.queryByTestId('status').textContent).toContain('In-Progress')
    expect(
      container.queryByText('Invoice for a plot at Nkwashi')
    ).toBeInTheDocument()
  })

  it('check when user is admin', () => {
    const invoiceMock = {
      description: 'Invoice for a plot at Nkwashi',
      amount: 200,
      dueDate: '2020-09-12',
      status: 'in_progress',
      landParcel: {
        parcelNumber: 'Plot-123'
      }
    }
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <InvoiceItem invoice={invoiceMock} userType="admin" />
        </MockedProvider>
      </BrowserRouter>)
    // shows make payment button when user is admin 
    expect(container.queryByTestId('pay-button').textContent).toContain('make payment')
    expect(container.queryByTestId('status').textContent).toContain('make payment')
    expect(
      container.queryByText('Invoice for a plot at Nkwashi')
    ).toBeInTheDocument()
  })
})
