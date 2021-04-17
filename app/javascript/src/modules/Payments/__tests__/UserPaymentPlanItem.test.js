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
    amount: 200,
    percentage: '50',
    planType: 'lease',
    createdAt: '2021-03-01T09:55:05Z',
    plotBalance: 0,
    pendingBalance: 10,
    startDate: '2021-03-01T09:55:05Z',
    status: 'active',
    id: '3b464fb7-bb2b-41cb-9245-9300b6d8a729',
    invoices: [
      {
        id: 'a54d6184-b10e-4865-bee7-7957701d423d',
        amount: 500,
        createdAt: '2021-03-01T09:55:05Z',
        dueDate: '2021-03-06T09:55:05Z',
        status: 'paid',
        invoiceNumber: 123,
        user: {
          name: 'Nurudeen'
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

    expect(container.getAllByTestId('plot-number')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('balance')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('start-date')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('percentage')[0]).toBeInTheDocument();

    const planClick = container.queryByTestId('summary');
    fireEvent.click(planClick);

    expect(container.getAllByTestId('issue-date')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('description')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('payment-date')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('status')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('amount')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('due-date')[0]).toBeInTheDocument();

    // find the menu and click it
    fireEvent.click(container.queryAllByTestId('menu')[0]);
    // the menu should be showing now
    expect(container.getAllByTestId('menu-open')[0]).toBeInTheDocument();
    expect(container.getAllByTestId('payment-day-1')[0]).toBeInTheDocument();

    // click on a menu item like day one
    fireEvent.click(container.queryAllByTestId('payment-day-1')[0]);
    // we should have called the mutation by now after a loader

    expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument();
    expect(container.queryByTestId('action-menu')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('action-menu'));
    expect(container.getByText(/Cancel Invoice/)).toBeInTheDocument();

    fireEvent.click(container.getByText(/Cancel Invoice/));
    expect(container.getByText(/You are about to delete Invoice for Nurudeen/)).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText('Payment Day successfully updated')).toBeInTheDocument();
      expect(refetch).toBeCalled();
    }, 50);
  });

  it('should check if renderPlan works as expected', () => {
    const menuData = {
      handleMenu: jest.fn(),
      loading: false
    };
    const results = renderPlan(plan, currency, user.userType, menuData);
    expect(results).toBeInstanceOf(Object);
    expect(results).toHaveProperty('Plot Number');
    expect(results).toHaveProperty('Balance');
    expect(results).toHaveProperty('Start Date');
    expect(results).toHaveProperty('% of total valuation');
    expect(results).toHaveProperty('Payment Day');

    const balanceContainer = render(results.Balance);

    expect(balanceContainer.queryByTestId('balance').textContent).toContain(10);
  });
});
