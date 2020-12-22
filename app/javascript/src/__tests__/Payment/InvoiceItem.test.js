import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
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
    const container = render(<InvoiceItem invoice={invoiceMock} />)
    expect(container.queryByTestId('amount').textContent).toContain('k200')
    expect(container.queryByTestId('duedate').textContent).toContain('2020-09-12')
    expect(container.queryByTestId('landparcel').textContent).toContain('Plot-123')
    expect(container.queryByTestId('status').textContent).toContain('Late')
    expect(
      container.queryByText('Invoice for a plot at Nkwashi')
    ).toBeInTheDocument()
  })
})
