import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import PaymentReceipt from '../Components/UserTransactions/PaymentReceipt';
import currency from '../../../__mocks__/currency';

jest.mock('react-signature-canvas');
describe('It should test the payment receipt modal component', () => {
  const paymentData = {
    id: 'yy893rhkj3hiujhf4u3hr43u',
    amount: 1000,
    status: 'paid',
    bankName: 'bank name',
    chequeNumber: '111123',
    transactionNumber: '257439',
    createdAt: '2020-12-28',
    planPayments: [{
      id: '27397iy2gr',
      receiptNumber: 't1234',
      currentPlotPendingBalance: 2000,
      paymentPlan: {
        id: 'y738o48r093',
        landParcel: {
          id: '3iu73u4ri3h',
          parcelNumber: 'P4444'
        }
      }
    }],
    user: {
      id: 'ui3iiui3',
      name: 'some name',
      extRefId: '234'
    },
    depositor: {
      id: 'ui3iiui3',
      name: 'some name'
    },
    community: {
      id: 'ui3iiui3',
      name: 'some name',
      logoUrl: 'img.jpg',
      currency: 'zambian_kwacha'
    }
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
            handleClose={handleModalClose}
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    expect(container.queryByText('Name')).toBeInTheDocument();
    expect(container.queryByText('NRC')).toBeInTheDocument();
    expect(container.queryByText('Date')).toBeInTheDocument();

    expect(container.queryByTestId('client-name')).toHaveTextContent('some name');
    expect(container.queryByTestId('nrc')).toHaveTextContent('234');

    expect(container.queryByTestId('plot-no')).toHaveTextContent('Plot/Plan No.');
    expect(container.queryByTestId('pay-type')).toHaveTextContent('Payment Type');
    expect(container.queryByTestId('amount')).toHaveTextContent('Amount Paid');

    expect(container.queryByText('Banking Details')).toBeNull();
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
            handleClose={handleModalClose}
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    expect(container.queryByText('Banking Details')).toBeInTheDocument();
    expect(container.queryByText('Bank Name')).toBeInTheDocument();
    expect(container.queryByText('Cheque Number')).toBeInTheDocument();
  });
});
