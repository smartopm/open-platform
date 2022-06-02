import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserPlan from '../Components/UserTransactions/Plans';
import { UserBalance } from '../../../graphql/queries';
import TransactionQuery, { UserPlans, GeneralPlanQuery } from '../graphql/payment_query';
import { Spinner } from '../../../shared/Loading';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { generateId } from '../../../utils/helpers';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

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
          userPlansWithPayments: [
            {
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
              planType: 'basic',
              startDate: '2021-01-26',
              installmentAmount: 200,
              paymentDay: 1,
              pendingBalance: 200,
              planValue: 300,
              duration: 12,
              status: 'paid',
              endDate: '2021-07-31',
              landParcel: {
                parcelNumber: 'Basic-123'
              },
              planPayments: [
                {
                  id: 'f280159d-ac71-4c22-997a-07fd07344c94',
                  createdAt: '2021-01-26',
                  amount: 200,
                  status: 'paid',
                  receiptNumber: 'RI2345',
                  paymentPlan: {
                    pendingBalance: 200,
                    landParcel: {
                      parcelNumber: 'test123'
                    }
                  },
                  userTransaction: {
                    source: 'cash',
                    transactionNumber: '23456',
                    allocatedAmount: 200,
                    depositor: {
                      name: 'some name'
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    };

    const genFundsMock = {
      request: {
        query: GeneralPlanQuery,
        variables: { userId }
      },
      result: {
        data: {
          userGeneralPlan: {
            id: 'f280159d-ac71-4c22-997a-07fd07344c94',
            generalPayments: 10000,
            planPayments: [
              {
                id: 'f280159d-ac71-4c22-997a-07fd07344c',
                createdAt: '2021-01-26',
                amount: 2000,
                status: 'paid',
                receiptNumber: 'test1234',
                userTransaction: {
                  id: 'f280159d-ac71-4c22-997a-07fd07344',
                  source: 'cash',
                  transactionNumber: 123456,
                  allocatedAmount: 200,
                  depositor: {
                    id: 'f280159d-ac71-4c22-997a-07fd0734',
                    name: 'some nane'
                  }
                }
              }
            ],
            user: {
              id: 'f280159d-ac71-4c22-997a-07fd07',
              name: 'another name',
              extRefId: '2345687'
            },
            community: {
              bankingDetails: {
                bankName: 'Test bank name',
                accountName: 'Thebe',
                accountNo: '1234',
                branch: 'Test branch',
                swiftCode: '032',
                sortCode: '456',
                address: '11, Nalikwanda Rd,',
                city: 'Lusaka',
                country: 'Zambia',
                taxIdNo: 'tax1234'
              },
              socialLinks: [{ category: 'website', social_link: 'www.web.com' }],
              supportEmail: [{ category: 'bank', email: 'payment@support.com' }],
              supportNumber: [{ category: 'bank', phone_number: '+260 1234' }],
              currency: 'kwacha'
            }
          }
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
          userTransactions: [
            {
              id: 'f280159d-ac71-4c22-997a-07fd07344c94',
              source: 'cash',
              createdAt: '2021-01-26',
              transactionNumber: 12345,
              allocatedAmount: 200,
              unallocatedAmount: 200,
              status: 'paid',
              depositor: {
                id: 'f280159d-ac71-4c22-997a-07fd07344c94',
                name: 'some name'
              },
              planPayments: [
                {
                  id: 'y68iu32r',
                  createdAt: '2021-08-08',
                  receiptNumber: 'TI23466',
                  amount: 200,
                  paymentPlan: {
                    pendingBalance: 200,
                    landParcel: {
                      parcelNumber: 'test123'
                    }
                  }
                }
              ],
              user: {
                id: 'f280159d-ac71-4c22-997a-07fd07344c94',
                name: 'some name',
                email: 'email@email.com',
                phoneNumber: '123456',
                extRefId: '25734'
              }
            }
          ]
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
            balance: 2000,
            pendingBalance: -12,
            totalTransactions: 2000
          }
        }
      }
    };

    const userData = {
      name: 'some name'
    };

    const container = render(
      <MockedProvider
        mocks={[planMock, balanceMock, transactionMock, genFundsMock]}
        addTypename={false}
      >
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <UserPlan userId={userId} user={authState.user} userData={userData} tab="Plans" />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('common:misc.total_balance')).toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });
});
