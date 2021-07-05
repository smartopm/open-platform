import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserPlan from '../Components/UserTransactions/Plans';
import { UserBalance } from '../../../graphql/queries';
import TransactionQuery, { UserPlans } from '../graphql/payment_query'
import { Spinner } from '../../../shared/Loading';
import { AuthStateProvider } from '../../../containers/Provider/AuthStateProvider';
import { generateId } from '../../../utils/helpers';

describe('Plan List Component', () => {
  it('should render the Plans list component', async () => {
    const userId = generateId()[1];
    const planMock = {
      request: {
        query: UserPlans,
        variables: { userId, limit: 10, offset: 0 }
      },
      result: {
        data: {
          userPlansWithPayments: [{
            planType: 'lease',
            startDate: '2021-01-26',
            monthlyAmount: '200',
            paymentDay: 1,
            pendingBalance: 200,
            id: 'f280159d-ac71-4c22-997a-07fd07344c94',
            landParcel: {
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
              parcelNumber: 'Basic-123'
            },
            planPayments: [{
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
              createdAt: '2021-01-26',
              amount: 200,
              status: 'paid',
              userTransaction: {
                id: 'f280159d-ac71-4c22-997a-07fd07344c94',
                source: 'cash'
              }
            }]
          }]
        }
      }
    };

    const transactionMock = {
      request: {
        query: TransactionQuery,
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
        mocks={[planMock, balanceMock, transactionMock]}
        addTypename={false}
      >
        <AuthStateProvider>
          <BrowserRouter>
            <UserPlan userId={userId} user={user} userData={userData} tab='Plans' />
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
