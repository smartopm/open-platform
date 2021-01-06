import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import InvoiceModal from '../../components/Payments/invoiceModal'
import { generateId } from '../../utils/helpers'
import { UserLandParcel } from '../../graphql/queries'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('It should test the invoice modal component', () => {
  const userId = generateId()[2]
  const landParcelMock = {
    request: {
      query: UserLandParcel,
      variables: { userId }
    },
    result: {
      data: {
        userLandParcel: [
          {
            id: '95e3c5f3-6757-48c1-837c-1d3e',
            parcelNumber: 'Plot-1343'
          }
        ]
      }
    }
  }
  const data = [
      {
        id: 'hiuwkeh',
        parcelNumber: 'ho2ij3'
      }
  ]

  const open = true

  const handleModalClose = jest.fn
  const user = {
    userId,
    userType: 'admin'
  }

  it('it should render invoice modal', () => {
    const container = render(
      <MockedProvider mocks={[landParcelMock]} addTypename={false}>
        <BrowserRouter>
          <InvoiceModal open={open} data={data} userId={user.userId} handleModalClose={handleModalClose} userType={user.userType} />
        </BrowserRouter>
      </MockedProvider> 
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