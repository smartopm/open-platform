import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import TransactionsList from '../../components/Payments/Transactions';
import { TransactionQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import { AuthStateProvider } from '../../containers/Provider/AuthStateProvider';
import { generateId } from '../../utils/helpers';

// TODO: first merge with @tolu's changes
describe.skip('Transactions Component', () => {
  it('should render the transactions list component', async () => {
    const userId = generateId()[1];
    const transactionsMock = {
      request: {
        query: TransactionQuery,
        variables: { userId, limit: 15, offset: 0, query: '' }
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
              chequeNumber: null,
              user: {
                id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
                name: 'joe doe'
              }
            },
            {
              amount: 344,
              status: 'settled',
              createdAt: '2020-12-23',
              updatedAt: '2021-01-27',
              currentWalletBalance: null,
              id: 'ec289778-8d32-4ec6-ba69-313058e61c19',
              chequeNumber: null,
              user: {
                id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
                name: 'joe doe'
              }
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
      <MockedProvider mocks={[transactionsMock]} addTypename={false}>
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
        expect(container.queryByText('Updated to settled on 2021-01-26')).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
