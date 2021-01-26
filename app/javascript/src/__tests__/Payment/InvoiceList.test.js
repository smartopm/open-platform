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

describe('Invoice Item Component', () => {
  it('should render the invoice item component', async () => {
    const userId = generateId()[1];
    const invoiceMock = {
      request: {
        query: TransactionQuery,
        variables: { userId, limit: 15, offset: 0 }
      },
      result: {
        data: {
          userInvoices: [
            {
              amount: 100,
              status: 'settled',
              createdAt: '2021-01-26T13:42:54Z',
              currentWalletBalance: 200,
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
              chequeNumber: null
            },
            {
              amount: 344,
              status: 'settled',
              createdAt: '2020-12-23T19:33:07Z',
              currentWalletBalance: null,
              id: 'ec289778-8d32-4ec6-ba69-313058e61c19',
              chequeNumber: null
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
      <MockedProvider mocks={[invoiceMock]} addTypename={false}>
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
        expect(container.queryByText('k50')).toBeInTheDocument();
        expect(container.queryByText('Updated to Late on 2020-12-20')).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
