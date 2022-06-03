import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { Spinner } from '../../../shared/Loading';
import { PlansList, SubscriptionPlans, renderSubscriptionPlans } from '../Components/PlansList';
import { CommunityPlansQuery } from '../graphql/payment_query';
import currency from '../../../__mocks__/currency';
import { PaymentReminderMutation } from '../graphql/payment_plan_mutations';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Plans List Item Component', () => {
  const subscriptionPlansData = {
    subscriptionPlans: [
      {
        amount: 100000,
        status: 'active',
        startDate: '2021-06-04',
        endDate: '2022-06-04',
        planType: 'basic',
        id: '5d0d8051-2510-567a-886a-48bbfa9f6414'
      }
    ]
  };

  const communityPaymentPlans = [
    {
      status: 'active',
      startDate: '2021-06-04',
      endDate: '2022-06-04',
      planType: 'basic',
      id: '5d0d8051-2510-567a-886a-48bbfa9f6414',
      totalPayments: 500,
      expectedPayments: 600,
      owingAmount: 100,
      installmentsDue: 1,
      pendingBalance: 200,
      planValue: 5000,
      planStatus: 'on_track',
      installmentAmount: '2000',
      upcomingInstallmentDueDate: '2021-11-13T10:53:16Z',
      user: {
        id: '5d0d8051-2510-567a-886a-48bbfa9f6423',
        name: 'John Doe',
        imageUrl: 'http://host.com/image.jpg',
        email: 'email@email.com',
        extRefId: '79821',
        phoneNumber: '9988776655'
      },
      landParcel: {
        parcelNumber: 'Plot01',
        parcelType: 'basic'
      },
      planPayments: [
        {
          id: '5d0d8051-2510-567a-886a-89945dasd4',
          amount: 100.0,
          status: 'paid',
          createdAt: '2020-11-13T10:53:16Z',
          receiptNumber: 'MI131'
        }
      ]
    }
  ];

  const mocks = [
    {
      request: {
        query: PaymentReminderMutation,
        variables: {
          userId: 'xsxnkjasnxkn-31',
          paymentPlanId: 'kjkjsadas-87'
        }
      },
      result: {
        data: {
          paymentRemiderCreate: { message: 'success' }
        }
      }
    },
    {
      request: {
        query: CommunityPlansQuery,
        variables: {
          query: ''
        }
      },
      result: {
        data: {
          communityPaymentPlans
        }
      }
    }
  ];
  it('should render the plans list component', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <PlansList
              currencyData={currency}
              matches={false}
              setDisplaySubscriptionPlans={jest.fn()}
              setMessage={jest.fn()}
              setAlertOpen={jest.fn()}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    expect(container.queryByTestId('csv-fab')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByTestId('plan_check_box')).toBeInTheDocument();
      },
      { timeout: 100 }
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('plan_check_box'));
      expect(container.queryByTestId('send_payment_button')).toBeInTheDocument();

      fireEvent.click(container.queryByTestId('send_payment_button'));
      expect(container.queryByText('misc.plan_reminder_confirmation')).toBeInTheDocument();
    });
  });

  it('should render the subscription plans component', async () => {
    render(
      <BrowserRouter>
        <MockedThemeProvider>
          <SubscriptionPlans
            currencyData={currency}
            matches={false}
            setMessage={jest.fn}
            setAlertOpen={jest.fn}
            subscriptionPlansLoading={false}
            subscriptionPlansData={subscriptionPlansData}
            subscriptionPlansRefetch={jest.fn}
            setDisplaySubscriptionPlans={jest.fn}
          />
        </MockedThemeProvider>
      </BrowserRouter>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
  });

  it('should check if renderSubscriptionPlans works as expected', () => {
    const menuData = {
      menuList: [
        { content: 'Edit subscription plan', isAdmin: true, color: '', handleClick: jest.fn() }
      ],
      handleTransactionMenu: jest.fn(),
      anchorEl: document.createElement('button'),
      open: true,
      userType: 'admin',
      handleClose: jest.fn()
    };
    const results = renderSubscriptionPlans(
      subscriptionPlansData.subscriptionPlans[0],
      currency,
      menuData
    );
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Plan Type');
    expect(results[0]).toHaveProperty('Start Date');
    expect(results[0]).toHaveProperty('End Date');
    expect(results[0]).toHaveProperty('Amount');
    expect(results[0]).toHaveProperty('Status');
  });
});
