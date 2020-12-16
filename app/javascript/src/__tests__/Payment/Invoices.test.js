import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import Invoices from '../../components/Payments/Invoice'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('It should test the invoice component', () => {
  const data = [
      {
        id: 'hiuwkeh',
        parcelNumber: 'ho2ij3'
      }
  ]

  it('it should render invoice modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <Invoices data={data} />
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId("invoice-button")).toBeInTheDocument()

    const invoiceButton = container.getByTestId("invoice-button")
    fireEvent.click(invoiceButton)
    
    
    expect(container.getByTestId("parcel-number")).toBeInTheDocument()
    expect(container.getByTestId("amount")).toBeInTheDocument()
    expect(container.getByTestId("status")).toBeInTheDocument()
    expect(container.getByTestId("description")).toBeInTheDocument()
    expect(container.getByTestId("note")).toBeInTheDocument()
  });
});