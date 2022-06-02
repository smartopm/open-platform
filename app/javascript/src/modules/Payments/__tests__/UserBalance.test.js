import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import Balance from '../Components/UserTransactions/UserBalance';
import { Spinner } from '../../../shared/Loading';
import { AuthStateProvider } from '../../../containers/Provider/AuthStateProvider';
import { generateId } from '../../../utils/helpers';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('User balance Component', () => {
  it('should render the user balance component', async () => {
    const userId = generateId()[1];
    const balanceData = {
      balance: 200.0,
      pendingBalance: 2000.0,
      totalTransactions: 1000.0
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
    };

    const container = render(
      <MockedProvider>
        <AuthStateProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <Balance
                userId={userId}
                user={user}
                userData={userData}
                refetch={jest.fn()}
                balanceData={balanceData}
                balanceRefetch={jest.fn()}
                csvRefetch={jest.fn()}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('common:misc.total_balance')).toBeInTheDocument();
        expect(container.queryByText('common:misc.total_transactions')).toBeInTheDocument();
        expect(container.queryByText('common:misc.general_funds')).toBeInTheDocument();
      },
      { timeout: 300 }
    );
  });
});
