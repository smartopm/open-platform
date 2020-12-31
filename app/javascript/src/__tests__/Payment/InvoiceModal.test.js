import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import InvoiceModal from '../../components/Payments/invoiceModal'
import { generateId } from '../../utils/helpers'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('It should test the invoice modal component', () => {
  const data = [
      {
        id: 'hiuwkeh',
        parcelNumber: 'ho2ij3'
      }
  ]

  const open = true

  const handleModalClose = jest.fn

  const userId = generateId()
  const user = {
    userId,
    userType: 'admin'
  }

  it('it should render invoice modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <InvoiceModal open={open} data={data} userId={user.userId} handleModalClose={handleModalClose} userType={user.userType} />
        </MockedProvider>
      </BrowserRouter>
    )

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