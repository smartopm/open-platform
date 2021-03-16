import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import PaymentPlan, { renderPlan } from "../../components/Payments/UserTransactions/UserPaymentPlanItem";
import currency from '../../__mocks__/currency'

describe('Render Transaction', () => {
  const plan = {
    amount: 200,
    percentage: '50',
    planType: 'lease',
    createdAt: '2021-03-01T09:55:05Z',
    plotBalance: 0,
    startDate: '2021-03-01T09:55:05Z',
    status: 'active',
    id: '3b464fb7-bb2b-41cb-9245-9300b6d8a729',
    invoices: [{
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      amount: 500,
      createdAt: '2021-03-01T09:55:05Z',
      status: 'paid',
      invoiceNumber: 123
    }],
    landParcel: {
      id: '233b1634-bf08-4ece-a213-b3f120a1e009',
      parcelNumber: 'Plot-1343'
    }
  }

  const plans = [plan];

  it('should render the invoice item component', () => {
    const container = render(
      <BrowserRouter>
        <PaymentPlan plans={plans} currencyData={currency} />
      </BrowserRouter>
    );

    expect(container.getAllByTestId("plot-number")[0]).toBeInTheDocument()
    expect(container.getAllByTestId("balance")[0]).toBeInTheDocument()
    expect(container.getAllByTestId("start-date")[0]).toBeInTheDocument()
    expect(container.getAllByTestId("percentage")[0]).toBeInTheDocument()

    const planClick = container.queryByTestId('summary')
    fireEvent.click(planClick)

    expect(container.getAllByTestId("issue-date")[0]).toBeInTheDocument()
    expect(container.getAllByTestId("description")[0]).toBeInTheDocument()
    expect(container.getAllByTestId("payment-date")[0]).toBeInTheDocument()
    expect(container.getAllByTestId("status")[0]).toBeInTheDocument()
    expect(container.getAllByTestId("amount")[0]).toBeInTheDocument()
  })

  it('should check if renderPlan works as expected', () => {
      const results = renderPlan(plan, currency)
      expect(results).toBeInstanceOf(Object);
      expect(results).toHaveProperty('Plot Number');
      expect(results).toHaveProperty('Balance');
      expect(results).toHaveProperty('Start Date');
      expect(results).toHaveProperty('% of total valuation');

      const balanceContainer = render(results.Balance)

      expect(balanceContainer.queryByTestId('balance').textContent).toContain(0)
  });
});
