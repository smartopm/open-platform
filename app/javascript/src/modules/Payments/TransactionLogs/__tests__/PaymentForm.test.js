import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import PaymentForm from '../Components/PaymentForm';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../__mocks__/authstate';

describe('PaymentForm', () => {
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
  });
});
