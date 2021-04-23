import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import TransactionsList from '../../modules/Payments/Components/UserTransactions/Transactions';
import { TransactionQuery, UserBalance, AllTransactionQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import { AuthStateProvider } from '../../containers/Provider/AuthStateProvider';
import { generateId } from '../../utils/helpers';

describe('Transactions Component', () => {
  it('should render the transactions list component', async () => {
    const userId = generateId()[1];
    const transactionsMock = {
      request: {
        query: TransactionQuery,
        variables: { userId, limit: 10, offset: 0 }
      },
      result: {
        data: {
          userDeposits: {
            transactions: [{
              amount: 200,
              source: 'cash',
              destination: 'invoice',
              createdAt: '2021-01-26',
              updatedAt: '2021-01-26',
              currentWalletBalance: 200,
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
              user: {
                id: 'f280159d-ac71-4c22-997a-07fd07344c94',
                name: 'some name'
              },
              depositor: {
                id: 'f280159d-ac71-4c22-997a-07fd07344c94',
                name: 'some depositor name'
              }
            }],
            pendingInvoices: [{
              amount: 200,
              pendingAmount: 200,
              invoiceNumber: 2315,
              dueDate: '2021-01-26',
              balance: 300,
              createdAt: '2021-01-26',
              id: 'f280159d-ac71-4c22-997a-07fd07344c94'
            }]
          }
        }
      }
    };
    const pendingInvoicesMock = {
      request: {
        query: UserBalance,
        variables: { userId, limit: 10, offset: 0 }
      },
      result: {
        data: {
          userBalance: '2000'
        }
      }
    };
    const pendingDepositMock = {
      request: {
        query: AllTransactionQuery,
        variables: { userId, limit: 10, offset: 0 }
      },
      result: {
        data: {
          invoicesWithTransactions: {
            invoices: [{
              amount: 200,
              status: 'paid',
              createdAt: '2021-01-21',
              dueDate: '2021-01-21',
              invoiceNumber: 123,
              updatedAt: '2021-01-21',
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
              landParcel: {
                id: 'f280159d-ac71-4c22-997a-07fd07344c94',
                parcelNumber: 'Test123'
              },
              payments: [{
                id: 'f280159d-ac71-4c22-997a-07fd07344c94',
                amount: '300',
                paymentType: 'cash',
                paymentStatus: 'settled',
                createdAt: '2021-01-21',
                user: {
                  id: 'f280159d-ac71-4c22-997a-07fd07344c94',
                  name: 'a name'
                }
              }]
            }],
            payments: [{
              amount: 344,
              paymentType: 'cash',
              createdAt: '2020-12-23',
              id: 'ec289778-8d32-4ec6-ba69-313058e61c19'
            }],
            paymentPlans: [{
              percentage: '50',
              planType: 'lease',
              createdAt: '2021-03-01T09:55:05Z',
              plotBalance: 0,
              startDate: '2021-03-01T09:55:05Z',
              status: 'active',
              id: '3b464fb7-bb2b-41cb-9245-9300b6d8a729',
              invoices: [{
                id: 'a54d6184-b10e-4865-bee7-7957701d423d',
                amount: 500,
                createdAt: '2021-03-01T09:55:05Z',
                dueDate: '2021-01-26',
                status: 'paid',
                invoiceNumber: 123
              }],
              landParcel: {
                id: '233b1634-bf08-4ece-a213-b3f120a1e009',
                parcelNumber: 'Plot-1343'
              }
            }]
          }
        }
      }
    };
    const user = {
      id: '939453bef34-f3',
      community: {
        currency: 'zambian_kwacha',
        locale: 'en-ZM'
      }
    };

    const container = render(
      <MockedProvider
        mocks={[transactionsMock, pendingInvoicesMock, pendingDepositMock]}
        addTypename
      >
        <AuthStateProvider>
          <BrowserRouter>
            <TransactionsList userId={userId} user={user} />
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryAllByText('Invoices')[0]).toBeInTheDocument();
        expect(container.queryByText('Transactions')).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
