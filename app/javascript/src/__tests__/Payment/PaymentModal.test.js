import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PaymentModal, { PaymentDetails } from '../../components/Payments/PaymentModal'

// jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
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

describe('Test Payment Details Screen', () => {
  const inputValue = {
    amount: '200',
    transactionType: 'cash',
    bankName: 'Standard',
    chequeNumber: '423-22223-099',
    transactionNumber: 'R45F112'
  }
  it('it should render payment details ', () => {
    const container = render(
      <PaymentDetails inputValue={inputValue} />
    )
    expect(container.queryByTestId('amount').textContent).toContain('Amount: 200')
    expect(container.queryByTestId('type').textContent).toContain('Transaction Type: cash')
    expect(container.queryByTestId('transactionNumber').textContent).toContain('Transaction Number: R45F112')
    expect(container.queryByTestId('chequeNumber').textContent).toContain('Cheque Number: 423-22223-099')
    expect(container.queryByTestId('bankName').textContent).toContain('Bank Name: Standard')

  });
})