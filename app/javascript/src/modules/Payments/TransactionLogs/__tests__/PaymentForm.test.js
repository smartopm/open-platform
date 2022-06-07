import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import ReactTestUtils from 'react-dom/test-utils';
import PaymentForm from '../Components/PaymentForm';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../__mocks__/authstate';

describe('PaymentForm', () => {
  const userEvent = ReactTestUtils.Simulate
  it('should render the payment form', () => {
    const container = render(
      <MockedProvider>
        <Context.Provider value={userMock}>
          <PaymentForm />
        </Context.Provider>
      </MockedProvider>
    );

    expect(container.queryByLabelText('form_fields.invoice_number')).toBeInTheDocument();
    expect(container.queryByLabelText('table_headers.amount')).toBeInTheDocument();
    expect(container.queryByLabelText('task:task.optional_description')).toBeInTheDocument();
    expect(container.queryByLabelText('form_fields.account_name')).toBeInTheDocument();
    expect(container.queryByText('payment:misc.make_a_payment')).toBeInTheDocument();
    expect(container.queryByTestId('make_a_payment_btn')).toBeInTheDocument();
    expect(container.queryByTestId('make_a_payment_btn').textContent).toContain(
      'misc.next'
      );
      userEvent.change(container.queryByLabelText('task:task.optional_description'), { target: { value: 'some description' } });
      expect(container.queryByLabelText('task:task.optional_description').value).toContain('some description');

      userEvent.change(container.queryByLabelText('form_fields.invoice_number'), { target: { value: 'some invoice number' } })
      expect(container.queryByLabelText('form_fields.invoice_number').value).toContain('some invoice number');

      userEvent.change(container.queryByLabelText('table_headers.amount'), { target: { value: '10000' } })
      expect(container.queryByLabelText('table_headers.amount').value).toContain('10000');

      userEvent.change(container.queryByLabelText('form_fields.account_name'), { target: { value: 'JU' } })
      expect(container.queryByLabelText('form_fields.account_name').value).toContain('JU');
  });
});
