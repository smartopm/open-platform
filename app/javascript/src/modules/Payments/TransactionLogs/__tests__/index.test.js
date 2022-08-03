import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { RenderPayment } from '..';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

describe('FW Payments', () => {
  it('renders payment form properly', () => {
    const container = render(
      <Context.Provider value={authState}>
        <BrowserRouter>
          <MockedProvider>
            <MockedThemeProvider>
              <RenderPayment />
            </MockedThemeProvider>
          </MockedProvider>
        </BrowserRouter>
      </Context.Provider>
    );
    expect(container.queryByLabelText('form_fields.invoice_number *')).toBeInTheDocument();
  });
});
