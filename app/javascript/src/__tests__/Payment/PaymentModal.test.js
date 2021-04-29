import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PaymentModal, { PaymentDetails } from '../../modules/Payments/Components/UserTransactions/PaymentModal'
import currency from '../../__mocks__/currency'
import { UserLandParcel } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import { PaymentCreate } from '../../graphql/mutations'

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

  const userLandParcel = [{
    id: '1234',
    parcelNumber: 'ho2ij3'
  }]

  it('it should render payment modal', async () => {
    const mock = [{
      request: {
        query: UserLandParcel,
        variables: {  userId: '279546' }
      },
      result: {
        data: {
          userLandParcel
        }
      }
    },
    {
    request: {
      query: PaymentCreate,
      variables: {}
    },
    error: new Error('An error occurred'),
  }
];
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={mock}>
          <PaymentModal
            open={open}
            invoiceData={invoiceData}
            handleModalClose={handleModalClose}
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>
    )

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.getByTestId("transaction-type")).toBeInTheDocument()
        expect(container.getAllByTestId("amount")[0]).toBeInTheDocument()
      },
      { timeout: 10 }
    );

    const transactionInput = container.queryByTestId('transaction-type')
    fireEvent.change(transactionInput, { target: { value: 'cash' } })
    expect(transactionInput).toHaveValue('cash')

    fireEvent.click(container.getByTestId("custom-dialog-button"))
  });
});

describe('Test Payment Details Screen', () => {
  const inputValue = {
    amount: '200',
    transactionType: 'cash',
    bankName: 'Standard',
    chequeNumber: '423-22223-099',
    transactionNumber: 'R45F112',
    pastPayment: true,
    receiptNumber: '234652'
  }
  it('it should render payment details ', () => {
    const container = render(
      <PaymentDetails inputValue={inputValue} currencyData={currency} />
    )
    expect(container.queryByTestId('amount').textContent).toContain('Amount: $200.00')
    expect(container.queryByTestId('type').textContent).toContain('Transaction Type: cash')
    expect(container.queryByTestId('transactionNumber').textContent).toContain('Transaction Number: R45F112')
    expect(container.queryByTestId('chequeNumber').textContent).toContain('Cheque Number: 423-22223-099')
    expect(container.queryByTestId('bankName').textContent).toContain('Bank Name: Standard')
    expect(container.queryByTestId('receiptNumber').textContent).toContain('Receipt Number: 234652')
  });
})