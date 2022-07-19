import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import PaymentModal, { PaymentDetails } from '../Components/UserTransactions/PaymentModal';
import currency from '../../../__mocks__/currency';
import { UserLandParcels } from '../../../graphql/queries';
import { Spinner } from '../../../shared/Loading';
import { PaymentCreate } from '../../../graphql/mutations';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

describe('It should test the payment modal component', () => {
  const open = true;

  const handleModalClose = jest.fn;

  const userLandParcels = [
    {
      id: '1234',
      parcelNumber: 'ho2ij3'
    }
  ];

  it('should render payment modal', async () => {
    const mock = [
      {
        request: {
          query: UserLandParcels,
          variables: { userId: '279546' }
        },
        result: {
          data: {
            userLandParcels
          }
        }
      },
      {
        request: {
          query: PaymentCreate,
          variables: {}
        },
        error: new Error('An error occurred')
      }
    ];
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={mock}>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <PaymentModal
                open={open}
                handleModalClose={handleModalClose}
                currencyData={currency}
                refetch={jest.fn()}
              />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.getByTestId('transaction-type')).toBeInTheDocument();
      },
      { timeout: 10 }
    );

    const transactionInput = container.queryByTestId('transaction-type');
    fireEvent.change(transactionInput, { target: { value: 'cash' } });
    expect(transactionInput).toHaveValue('cash');

    fireEvent.click(container.getByTestId('custom-dialog-button'));
  });
});

describe('Test Payment Details Screen', () => {
  const inputValue = {
    transactionType: 'cash',
    bankName: 'Standard',
    chequeNumber: '423-22223-099',
    transactionNumber: 'R45F112',
    pastPayment: true
  };
  it('should render payment details', () => {
    const container = render(
      <MockedThemeProvider>
        <MockedSnackbarProvider>
          <PaymentDetails inputValue={inputValue} totalAmount={200} currencyData={currency} />
        </MockedSnackbarProvider>
      </MockedThemeProvider>
    );
    expect(container.queryByTestId('amount')).toBeInTheDocument();
    expect(container.queryByTestId('type').textContent).toContain(
      'table_headers.transaction_type: cash'
    );
    expect(container.queryByTestId('transactionNumber').textContent).toContain(
      'common:table_headers.transaction_number: R45F112'
    );
    expect(container.queryByTestId('chequeNumber').textContent).toContain(
      'common:table_headers.cheque_number: 423-22223-099'
    );
    expect(container.queryByTestId('bankName').textContent).toContain(
      'common:table_headers.bank_name: Standard'
    );
  });
});
