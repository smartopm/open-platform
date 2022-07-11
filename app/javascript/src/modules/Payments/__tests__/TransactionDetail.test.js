import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import TransactionDetails from '../Components/UserTransactions/TransactionDetails';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('It should test the transaction detail modal component', () => {
  const data = {
    id: 't657yhgy',
    createdAt: '2021-08-08',
    amount: 200,
    receiptNumber: 'SI1234',
    paymentPlan: {
      pendingBalance: 200,
      statementPaidAmount: 200,
      unallocatedAmount: 200,
      landParcel: {
        parcelNumber: 'test123'
      }
    },
    userTransaction: {
      source: 'cash',
      transactionNumber: 'test123',
      depositor: {
        name: 'some-name'
      }
    }
  };

  it('should render transaction detail modal', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <TransactionDetails
                open
                handleModalClose={jest.fn}
                currencyData={{ currency: 'ZMW', locale: 'en-ZM' }}
                data={data}
              />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByTestId('title')).toBeInTheDocument();
    expect(container.getByTestId('payment-date')).toBeInTheDocument();
    expect(container.getByTestId('transaction-type')).toBeInTheDocument();
    expect(container.getByTestId('detail-card')).toBeInTheDocument();
    expect(container.getByTestId('total-amount')).toBeInTheDocument();
  });
});
