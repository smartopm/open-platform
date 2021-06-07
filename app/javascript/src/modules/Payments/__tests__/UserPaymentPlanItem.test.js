import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import PaymentPlan, { renderPlan } from '../Components/UserTransactions/UserPaymentPlanItem';
import currency from '../../../__mocks__/currency';
import PaymentPlanUpdateMutation from '../graphql/payment_plan_mutations';

describe('Render Payment Plan Item', () => {
  const plan = {
    planType: 'lease',
    startDate: '2021-01-26',
    monthlyAmount: '200',
    paymentDay: 1,
    pendingBalance: 200,
    id: 'f280159d-ac71-4c22-997a-07fd07344c94',
    planPayments: [{
      id: 'f280159d-ac71-4c22-997a-07fd07344c94',
      createdAt: '2021-01-26',
      amount: 200,
      status: 'paid',
      userTransaction: {
        id: 'f280159d-ac71-4c22-997a-07fd07344c94',
        source: 'cash'
      }
    }],
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
        variables: { id: plan.id, userId: user.userId, paymentDay: 2 }
      },
      result: { data: { paymentDayUpdate: { paymentPlan: { id: plan.id } } } }
    };
    const refetch = jest.fn();
    const container = render(
      <MockedProvider mocks={[requestMock]} addTypename={false}>
        <BrowserRouter>
          <PaymentPlan
            plans={plans}
            currencyData={currency}
            userId={user.userId}
            currentUser={{ userType: 'admin' }}
            refetch={refetch}
            walletRefetch={() => {}}
          />
        </BrowserRouter>
      </MockedProvider>
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

    expect(container.getAllByTestId('pay-menu')[0]).toBeInTheDocument();
    fireEvent.click(container.getAllByTestId('pay-menu')[0]);
    expect(container.getByText('View Receipt')).toBeInTheDocument();

    // click on a menu item like day one
    fireEvent.click(container.queryAllByTestId('payment-day-1')[0]);
    // we should have called the mutation by now after a loader

    expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument();


    await waitFor(() => {
      expect(container.queryByText('Payment Day successfully updated')).toBeInTheDocument();
      expect(refetch).toBeCalled();
    }, 50);

    expect(container.getAllByTestId('plan-menu')[0]).toBeInTheDocument();
    fireEvent.click(container.getAllByTestId('plan-menu')[0]);
    expect(container.getByText('View Statement')).toBeInTheDocument();
    fireEvent.click(container.getByText('View Statement'));
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
