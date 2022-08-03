import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import currency from '../../../__mocks__/currency';
import UserTransactionsList, {
  renderTransactions
} from '../Components/UserTransactions/UserTransactions';
import { AllEventLogsQuery } from '../../../graphql/queries';
import { TransactionRevert } from '../graphql/payment_mutations';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

describe('Render Transaction', () => {
  const transaction = {
    amount: 200,
    source: 'wallet',
    destination: 'deposit',
    status: 'settled',
    createdAt: '2021-03-01T09:55:05Z',
    updatedAt: '2021-03-01T09:55:05Z',
    currentWalletBalance: 100,
    chequeNumber: null,
    bankName: null,
    transactionNumber: null,
    id: '3b464fb7-bb2b-41cb-9245-9300b6d8a729',
    depositor: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy'
    },
    __typename: 'WalletTransaction'
  };

  const menuData = {
    menuList: [{ content: 'Example', isAdmin: true, color: '', handleClick: jest.fn() }],
    handleTransactionMenu: jest.fn(),
    anchorEl: document.createElement("button"),
    open: true,
    userType: 'admin',
    handleClose: jest.fn()
  };

  const userData = {
    name: 'test-name'
  };

  it('should render the Transaction item component', async () => {
    const mock = [
      {
        request: {
          query: AllEventLogsQuery,
          variables: {
            subject: ['payment_update'],
            refId: transaction.id,
            refType: 'Payments::WalletTransaction'
          }
        },
        result: {
          data: {
            result: {
              id: '385u9432n384ujdf',
              createdAt: '2021-03-03T12:40:38Z',
              refId: transaction.id,
              refType: 'Payments::WalletTransaction',
              subject: 'payment_update',
              sentence: 'Joe made changes to this payment',
              data: {},
              actingUser: {
                name: 'Joe',
                id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
              },
              entryRequest: null
            }
          }
        }
      },
      {
        request: {
          query: TransactionRevert,
          variables: {
            id: transaction.id
          }
        },
        result: {
          data: {
            transactionRevert: {
              transaction: {
                id: '385u9432n384ujdf',
                status: 'paid'
              }
            }
          }
        }
      }
    ];
    const container = render(
      <MockedProvider mocks={mock} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <UserTransactionsList
                transaction={transaction}
                currencyData={currency}
                userType="admin"
                userData={userData}
                refetch={() => {}}
                balanceRefetch={() => {}}
              />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByTestId('date')).toBeInTheDocument();
      expect(container.queryByTestId('recorded')).toBeInTheDocument();
      expect(container.queryByTestId('description')).toBeInTheDocument();

      fireEvent.click(container.queryAllByTestId('menu')[0])
      expect(container.queryByText("common:menu.revert_transaction")).toBeInTheDocument();

      fireEvent.click(container.queryByText("common:menu.revert_transaction"))
      expect(container.queryByText("dialogs.dialog_action")).toBeInTheDocument();
    }, 10)
  });

  it('should render the Transaction item component without transactions', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <UserTransactionsList
                transaction={{}}
                currencyData={currency}
                userType="admin"
                userData={userData}
                refetch={() => {}}
                balanceRefetch={() => {}}
              />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByText('No Transactions Yet')).toBeInTheDocument();
  });

  it('should check if renderTransaction works as expected', () => {
    const results = renderTransactions(transaction, currency, menuData);
    expect(results).toBeInstanceOf(Object);
    expect(results).toHaveProperty('Date');
    expect(results).toHaveProperty('Recorded by');
    expect(results).toHaveProperty('Payment Type');
    expect(results).toHaveProperty('Amount Paid');

    const statusContainer = render(results.Date);
    expect(statusContainer.queryByTestId('date').textContent).toContain('2021-03-01');
  });
});
