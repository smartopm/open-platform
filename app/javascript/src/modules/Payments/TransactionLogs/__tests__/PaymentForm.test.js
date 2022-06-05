import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PaymentForm from '../Components/PaymentForm';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../__mocks__/authstate';

describe('PaymentForm', () => {
  it('should render the payment form', () => {
    const container = render(
      <Context.Provider value={userMock}>
        <PaymentForm />
      </Context.Provider>
    );

    expect(container.queryByLabelText('common:form_fields.invoice_number')).toBeInTheDocument();
    expect(container.queryByLabelText('common:table_headers.amount')).toBeInTheDocument();
    expect(container.queryByLabelText('common:form_fields.description')).toBeInTheDocument();
    expect(container.queryByTestId('make_a_payment_btn')).toBeInTheDocument();
    expect(container.queryByTestId('make_a_payment_btn').textContent).toContain(
      'common:misc.make_a_payment'
    );
  });
});
