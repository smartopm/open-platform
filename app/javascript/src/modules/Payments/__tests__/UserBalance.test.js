import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import Balance from '../Components/UserTransactions/UserBalance';
import { UserBalance } from '../../../graphql/queries';
import DepositQuery from '../graphql/payment_query'
import { Spinner } from '../../../shared/Loading';
import { AuthStateProvider } from '../../../containers/Provider/AuthStateProvider';
import { generateId } from '../../../utils/helpers';

describe('User balance Component', () => {
  it('should render the user balance component', async () => {
    const userId = generateId()[1];
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
        mocks={[balanceMock]}
        addTypename={false}
      >
        <AuthStateProvider>
          <BrowserRouter>
            <Balance userId={userId} user={user} userData={userData} refetch={jest.fn()} />
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('common:misc.total_balance')).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
