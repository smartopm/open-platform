import React from 'react';
import { render } from "@testing-library/react";
import RenderPayment from "..";
import { Context } from "../../../../containers/Provider/AuthStateProvider";
import authState from "../../../../__mocks__/authstate";

describe('FW Payments', () => {
  it('renders payment form properly', () => {
    const container = render(
      <Context.Provider value={authState}>
        <RenderPayment />
      </Context.Provider>
    )
    expect(container.queryByLabelText('common:form_fields.invoice_number')).toBeInTheDocument();
  });
});
