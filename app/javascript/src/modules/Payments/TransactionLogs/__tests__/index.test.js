import React from 'react';
import { render } from "@testing-library/react";
import { MockedProvider } from '@apollo/react-testing';
import RenderPaymentForm from "..";
import { Context } from "../../../../containers/Provider/AuthStateProvider";
import authState from "../../../../__mocks__/authstate";

describe('FW Payments', () => {
  it('renders payment form properly', () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <RenderPaymentForm />
        </MockedProvider>
      </Context.Provider>
    )
    expect(container.queryByLabelText('form_fields.invoice_number *')).toBeInTheDocument();
  });
});
