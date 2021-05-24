import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import TransactionsList from '../Components/UserTransactions/Transactions';
import { UserBalance } from '../../../graphql/queries';
import DepositQuery from '../graphql/payment_query'
import { Spinner } from '../../../shared/Loading';
import { AuthStateProvider } from '../../../containers/Provider/AuthStateProvider';
import { generateId } from '../../../utils/helpers';

describe('Transactions Component', () => {
  it('should render the transactions list component', async () => {
    const userId = generateId()[1];
    const depositMock = {
      request: {
        query: DepositQuery,
        variables: { userId, limit: 10, offset: 0 }
      },
      result: {
        data: {
          userTransactions: [{
            allocatedAmount: 200,
            unallocatedAmount: 200,
            source: 'cash',
            transactionNumber: 12345,
            createdAt: '2021-01-26',
            id: 'f280159d-ac71-4c22-997a-07fd07344c94',
            user: {
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
              name: 'some name'
            }
          }]
        }
      }
    };
    const balanceMock = {
      request: {
        query: UserBalance,
        variables: { userId }
      },
      result: {
        data: {
          userBalance: {
            balance: '2000',
            pendingBalance: '-12.0'
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

    const userData = {
      name: 'some name'
    }

    const container = render(
      <MockedProvider
        mocks={[depositMock, balanceMock]}
        addTypename={false}
      >
        <AuthStateProvider>
          <BrowserRouter>
            <TransactionsList userId={userId} user={user} userData={userData} />
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('common:misc.make_payment')).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
