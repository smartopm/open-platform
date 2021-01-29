import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import TransactionsList from '../../components/Payments/Transactions';
import { TransactionQuery, PendingInvoicesQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import { AuthStateProvider } from '../../containers/Provider/AuthStateProvider';
import { generateId } from '../../utils/helpers';

describe('Transactions Component', () => {
  it('should render the transactions list component', async () => {
    const userId = generateId()[1];
    const transactionsMock = {
      request: {
        query: TransactionQuery,
        variables: { userId, limit: 15, offset: 0 }
      },
      result: {
        data: {
          userWalletTransactions: [
            {
              amount: 100,
              status: 'settled',
              createdAt: '2021-01-26',
              updatedAt: '2021-01-26',
              currentWalletBalance: 200,
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
              chequeNumber: null
            },
            {
              amount: 344,
              status: 'settled',
              createdAt: '2020-12-23',
              updatedAt: '2021-01-27',
              currentWalletBalance: null,
              id: 'ec289778-8d32-4ec6-ba69-313058e61c19',
              chequeNumber: null
            }
          ]
        }
      }
    };

    const pendingInvoicesMock = {
      request: {
        query: PendingInvoicesQuery,
        variables: { userId, limit: 15, offset: 0 }
      },
      result: {
        data: {
          pendingInvoices: [
            {
              amount: 200,
              status: 'settled',
              createdAt: '2021-01-21',
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
            },
            {
              amount: 344,
              status: 'settled',
              createdAt: '2020-12-23',
              id: 'ec289778-8d32-4ec6-ba69-313058e61c19',
            }
          ]
        }
      }
    };

    const user = {
      id: '939453bef34-f3',
      community: {
        currency: 'zambian_kwacha'
      }
    };

    const container = render(
      <MockedProvider mocks={[transactionsMock, pendingInvoicesMock]} addTypename={false}>
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
        expect(container.queryByText('k100')).toBeInTheDocument();
        expect(container.queryByText('Balance of k200')).toBeInTheDocument();
        expect(container.queryByText('Paid on 2021-01-26')).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
