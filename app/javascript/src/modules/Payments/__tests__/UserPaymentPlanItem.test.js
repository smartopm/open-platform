import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { useTranslation } from 'react-i18next';
import PaymentPlan, { renderPlan } from '../Components/UserTransactions/UserPaymentPlanItem';
import currency from '../../../__mocks__/currency';
import PaymentPlanUpdateMutation from '../graphql/payment_plan_mutations';
import authState from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Render Payment Plan Item', () => {
  const { t } = useTranslation('common');
  const plan = {
    planType: 'basic',
    startDate: '2021-01-26',
    installmentAmount: 200,
    paymentDay: 1,
    frequency: 'monthly',
    paidPaymentsExists: true,
    pendingBalance: 200,
    id: 'f280159d-ac71-4c22-997a-07fd07344c94',
    status: 'active',
    planPayments: [
      {
        id: 'f280159d-ac71-4c22-997a-07fd07344c94',
        createdAt: '2021-01-26',
        amount: 200,
        status: 'paid',
        userTransaction: {
          id: 'f280159d-ac71-4c22-997a-07fd07344c94',
          source: 'cash'
        }
      }
    ],
    landParcel: {
      id: '233b1634-bf08-4ece-a213-b3f120a1e009',
      parcelNumber: 'Plot-1343'
    }
  };

  const plans = [plan];
  const user = {
    userId: '039490-sdfs9432-9432e-dsdf',
    userType: 'admin'
  };

  it('should render the payment plan item component', async () => {
    const requestMock = {
      request: {
        query: PaymentPlanUpdateMutation,
        variables: { planId: plan.id, paymentDay: 2 }
      },
      result: { data: { paymentPlanUpdate: { paymentPlan: { id: plan.id } } } }
    };
    const refetch = jest.fn();
    const currentUser = {
      userType: 'admin',
      permissions: [
        {
          module: 'payment_plan',
          permissions: ['can_update_payment_day', 'can_view_menu_list']
        },
        {
          module: 'plan_payment',
          permissions: ['can_view_menu_list']
        }
      ]
    };
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[requestMock]} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <PaymentPlan
                plans={plans}
                currencyData={currency}
                userId={user.userId}
                currentUser={currentUser}
                refetch={refetch}
                balanceRefetch={() => {}}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getAllByTestId('payment-date')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('payment-type')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('amount')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('status')[0]).toBeInTheDocument();

    const planClick = container.queryByTestId('summary');
    fireEvent.click(planClick);

    expect(container.getAllByTestId('plot-number')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('payment-plan')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('start-date')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('balance')[0]).toBeInTheDocument();

    // find the menu and click it
    fireEvent.click(container.queryAllByTestId('menu')[0]);
    // the menu should be showing now
    expect(container.getAllByTestId('menu-open')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('payment-day-1')[0]).toBeInTheDocument();

    // click on a menu item like day one
    fireEvent.click(container.queryAllByTestId('payment-day-1')[0]);
    // we should have called the mutation by now after a loader

    expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText('misc.pay_day_updated')).toBeInTheDocument();
      expect(refetch).toBeCalled();


    expect(container.getAllByTestId('pay-menu')[0]).toBeInTheDocument();
    fireEvent.click(container.getAllByTestId('pay-menu')[0]);
    expect(container.getByText('common:menu.view_receipt')).toBeInTheDocument();

    expect(container.getAllByTestId('plan-menu')[0]).toBeInTheDocument();
    fireEvent.click(container.getAllByTestId('plan-menu')[0]);
    expect(container.getByText(t('common:menu.view_statement'))).toBeInTheDocument();
    fireEvent.click(container.getByText(t('common:menu.view_statement')));
    expect(container.getByText(t('common:menu.cancel_plan'))).toBeInTheDocument();
    fireEvent.click(container.getByText(t('common:menu.cancel_plan')));
    expect(container.getByText(t('common:menu.view_transactions'))).toBeInTheDocument();
    fireEvent.click(container.getByText(t('common:menu.view_transactions')));
    expect(container.getByText(t('common:menu.view_details'))).toBeInTheDocument();
    fireEvent.click(container.getByText(t('common:menu.view_details')));
    expect(container.getByText(t('common:menu.transfer_payment_plan'))).toBeInTheDocument();
    fireEvent.click(container.getByText(t('common:menu.transfer_payment_plan')));
  }, 20);
  });

  it('should check if renderPlan works as expected', () => {
    const menuData = {
      handleMenu: jest.fn(),
      loading: false
    };
    const results = renderPlan(plan, currency, user.userType, menuData);
    expect(results).toBeInstanceOf(Object);
    expect(results).toHaveProperty('Plot Number');
    expect(results).toHaveProperty('Payment Plan');
    expect(results).toHaveProperty('Start Date');
    expect(results).toHaveProperty('Balance/Monthly Amount');
  });
});
