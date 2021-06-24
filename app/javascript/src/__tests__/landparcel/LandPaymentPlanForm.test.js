/* eslint-disable camelcase */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import PaymentPlanForm from '../../components/LandParcels/PaymentPlanForm';

describe('PaymentPlanForm Component', () => {
  const landParcel = {
    id: '342bbccf-4899-47eb-922c-962484d0c41d',
    accounts: [
      {
        user: {
          id: '5eb54366-5558-4c48-ae1e-ef11d9ecdedd'
        }
      }
    ]
  };
  it('should correctly with text inputs', () => {
    const refetch = jest.fn();
    const container = render(
      <MockedProvider mocks={[]}>
        <PaymentPlanForm landParcel={landParcel} refetch={refetch} />
      </MockedProvider>
    );
    // check if it renders as expected
    const purchase_plan = container.queryByLabelText('purchase_plan');
    const payment_plan_owner = container.queryByLabelText('payment_plan_owner');
    const status = container.queryByLabelText('status');
    const percentage = container.queryByLabelText('Percentage-of-premium-paid');
    const monthlyAmount = container.queryByLabelText('monthly-amount');
    const duration = container.queryByLabelText('duration-in-month');
    const submit_btn = container.queryByTestId('submit_btn');

    expect(purchase_plan.textContent).toContain('Purchase Plan');
    expect(payment_plan_owner.textContent).toContain('Choose Payment Plan User');
    expect(status.textContent).toContain('Status');
    expect(percentage.textContent).toContain('Percentage of premium paid');
    expect(monthlyAmount.textContent).toContain('Monthly Amount');
    expect(duration.textContent).toContain('Duration(in months)');
    expect(submit_btn.textContent).toContain('Save Plan');
    expect(container.queryByTestId('date-picker').textContent).toContain('Start Date');
    expect(container.queryByTestId('total-amount-txt')).toBeNull()

    expect(status.querySelector('input').value).toBe('0');

    fireEvent.change(percentage.querySelector('input'), { target: { value: '10' } });
    expect(percentage.querySelector('input').value).toBe('10');

    fireEvent.change(monthlyAmount.querySelector('input'), { target: { value: '2000' } });
    expect(monthlyAmount.querySelector('input').value).toBe('2000');

    fireEvent.change(duration.querySelector('input'), { target: { value: '12' } });
    expect(duration.querySelector('input').value).toBe('12');

    fireEvent.select(purchase_plan.querySelector('input'), { target: { value: 'lease' } });
    expect(purchase_plan.querySelector('input').value).toBe('lease');
    // we shouldn't have validation errors before attempting to submit
    expect(percentage.textContent).not.toContain('Percentage is required');
    fireEvent.click(submit_btn);
    // check for validation errors after attempting to save
    expect(percentage.textContent).toContain('Percentage is required');
    expect(payment_plan_owner.textContent).toContain('User is required');
  });
});
