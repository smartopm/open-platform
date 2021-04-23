import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import PaymentReceipt from '../../modules/Payments/Components/UserTransactions/PaymentReceipt';
import currency from '../../__mocks__/currency';

jest.mock('react-signature-canvas');
describe('It should test the payment receipt modal component', () => {
  const paymentData = {
    amount: 1000,
    source: 'cash',
    currentWalletBalance: 100,
    currentPendingPlotBalance: 9000,
    settledInvoices: [
      {
        id: 'gey617',
        invoice_number: '1011',
        due_date: '2021-04-19',
        amount_owed: 1000,
        amount_paid: 1000,
        amount_remaining: 0
      }
    ],
    user: {
      name: 'some name'
    },
    depositor: {
      name: 'some name'
    },
    paymentPlan: {
      landParcel: {
        parcelNumber: 'P4444'
      }
    }
  };

  const userData = {
    name: 'some name 2',
    transactionNumber: 1234
  };

  const open = true;

  const handleModalClose = jest.fn();

  it('it should render payment receipt modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <PaymentReceipt
            open={open}
            paymentData={paymentData}
            userData={userData}
            handleClose={handleModalClose}
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    expect(container.queryByText('Invoice Number')).toBeInTheDocument();
    expect(container.queryByText('Due Date')).toBeInTheDocument();
    expect(container.queryByText('Amount Owed')).toBeInTheDocument();
    expect(container.queryByText('Amount Paid')).toBeInTheDocument();
    expect(container.queryByText('Amount Remaining')).toBeInTheDocument();
    expect(container.queryByText('Signature')).toBeInTheDocument();

    expect(container.queryByTestId('client-name')).toHaveTextContent('some name 2');
    expect(container.queryByTestId('total-amount-paid')).toHaveTextContent('$1,000.00');
    expect(container.queryByTestId('payment-mode')).toHaveTextContent('cash');
    expect(container.queryByTestId('plan-property')).toHaveTextContent('P4444');

    expect(container.queryByTestId('invoice-number')).toHaveTextContent('1011');
    expect(container.queryByTestId('due-date')).toHaveTextContent('2021-04-19');
    expect(container.queryByTestId('amount-owed')).toHaveTextContent('$1,000.00');
    expect(container.queryByTestId('amount-paid')).toHaveTextContent('$1,000.00');
    expect(container.queryByTestId('amount-remaining')).toHaveTextContent('$0.00');

    expect(container.queryByTestId('plan-balance')).toHaveTextContent('$9,000.00');
    expect(container.queryByTestId('unallocated-funds')).toHaveTextContent('$0.00');
    expect(container.queryByTestId('cashier-name')).toHaveTextContent('some name');

    expect(container.queryByText('Account Details')).toBeNull();
    expect(container.queryByText('Bank Name')).toBeNull();
    expect(container.queryByText('Cheque Number')).toBeNull();
  });

  it('it should render account details if source is cheque', () => {
    const newPaymentData = {
      ...paymentData,
      source: 'cheque/cashier_cheque'
    };

    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <PaymentReceipt
            open={open}
            paymentData={newPaymentData}
            userData={userData}
            handleClose={handleModalClose}
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    expect(container.queryByText('Account Details')).toBeInTheDocument();
    expect(container.queryByText('Bank Name')).toBeInTheDocument();
    expect(container.queryByText('Cheque Number')).toBeInTheDocument();
  });
});
