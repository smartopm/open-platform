import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import InvoiceItem from '../../components/Payments/InvoiceItem'
import { Spinner } from '../../shared/Loading'
import currency from '../../__mocks__/currency'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Invoice Item Component', () => {
  it('should render the invoice item component', async () => {
    const invoiceMock = {
      amount: 200,
      invoiceNumber: 1,
      dueDate: '2020-09-12',
      status: 'in_progress',
      createdAt: '2020-12-28',
      landParcel: {
        parcelNumber: 'Plot-123'
      },
      createdBy: {
        id: '9485rjdsfiu34',
        name: 'Some name'
      }
    }

    const loader = render(<Spinner />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <InvoiceItem 
            invoice={invoiceMock} 
            userType="client" 
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>)

    await waitFor(() => {
      // shows the invoice status when user is not admin
      expect(container.queryByTestId('amount').textContent).toContain('$200')
      expect(container.queryByTestId('duedate').textContent).toContain('2020-09-12')
      expect(container.queryByTestId('landparcel').textContent).toContain('Plot-123')
      expect(container.queryByTestId('pay-button')).toBeNull()
      expect(container.queryByTestId('status').textContent).toContain('In-Progress')
    },
    { timeout: 500 }
    ) 
  })

  it('check when user is admin', () => {
    const invoiceMock = {
      amount: 200,
      dueDate: '2020-09-12',
      status: 'in_progress',
      createdAt: '2020-12-28',
      landParcel: {
        parcelNumber: 'Plot-123'
      }
    }
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <InvoiceItem 
            invoice={invoiceMock} 
            userType="admin" 
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>)
    // shows make payment button when user is admin
    expect(container.queryByTestId('pay-button').textContent).toContain('make payment')
    expect(container.queryByTestId('status').textContent).toContain('make payment')
  })
})
