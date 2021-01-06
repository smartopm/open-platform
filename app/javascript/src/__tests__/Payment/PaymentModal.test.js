import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PaymentModal from '../../components/Payments/PaymentModal'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('It should test the payment modal component', () => {
  const invoiceData =
      {
        amount: '1000',
        landParcel: {
          parcelNumber: 'ho2ij3'
        }
      }

  const open = true

  const handleModalClose = jest.fn

  it('it should render payment modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <PaymentModal open={open} invoiceData={invoiceData} handleModalClose={handleModalClose} />
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId("transaction-type")).toBeInTheDocument()
    expect(container.getByTestId("amount")).toBeInTheDocument()

    const transactionInput = container.queryByTestId('transaction-type')
    fireEvent.change(transactionInput, { target: { value: 'cash' } })
    expect(transactionInput.value).toBe('cash')
  });
});