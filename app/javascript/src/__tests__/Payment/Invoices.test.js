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

  const userId = 'jwuifhwef'
  const user = {
    id: 'yjfefe',
    userType: 'admin'
  }

  it('it should render invoice modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <Invoices data={data} userId={userId} user={user} />
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

    const parcelInput = container.queryByTestId('parcel-number')
    fireEvent.change(parcelInput, { target: { value: '1234' } })
    expect(parcelInput.value).toBe('1234')

    const statusInput = container.queryByTestId('status')
    fireEvent.change(statusInput, { target: { value: 'paid' } })
    expect(statusInput.value).toBe('paid')

    const descriptionInput = container.queryByTestId('description')
    fireEvent.change(descriptionInput, { target: { value: 'description' } })
    expect(descriptionInput.value).toBe('description')

    const noteInput = container.queryByTestId('note')
    fireEvent.change(noteInput, { target: { value: 'note' } })
    expect(noteInput.value).toBe('note')
  });
});