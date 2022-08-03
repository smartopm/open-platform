import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import TransactionsList from '../Components/UserTransactions/Transactions';
import { Spinner } from '../../../shared/Loading';
import { AuthStateProvider } from '../../../containers/Provider/AuthStateProvider';
import { generateId } from '../../../utils/helpers';

describe('Transactions Component', () => {
  it('should render the transactions list component', async () => {
    const userId = generateId()[1];
    const transData = {
      userTransactions: [
        {
          allocatedAmount: 200,
          unallocatedAmount: 200,
          source: 'cash',
          transactionNumber: 12345,
          createdAt: '2021-01-26',
          id: 'f280159d-ac71-4c22-997a-07fd07344c94',
          status: 'paid',
          depositor: {
            id: 'f280159d-ac71-4c22-997a-07fd07344c94',
            name: 'some name'
          },
          user: {
            id: 'f280159d-ac71-4c22-997a-07fd07344c94',
            name: 'some name',
            email: 'email@email.com',
            phoneNumber: '123456',
            extRefId: '25734'
          }
        }
      ]
    };

    const user = {
      id: '939453bef34-f3',
      userType: 'admin',
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
            <TransactionsList
              userId={userId}
              user={user}
              transData={transData}
              userData={userData}
              refetch={jest.fn()}
              balanceRefetch={jest.fn()}
              setFiltering={jest.fn()}
              filtering={false}
            />
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('common:menu.transaction_plural')).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
