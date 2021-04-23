import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import TabbedPayments from '../../modules/Payments/Components/TabbedPayments';

describe('Tabbed Payment Component', () => {
  const authState = {
    user: {
      userType: 'admin',
      community: {
        currency: 'k',
        locale: 'nkw'
      }
    }
  }

  it('renders Tabbed Payment Templates', async () => {
    await act(async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <TabbedPayments authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByText('Invoices')).toBeInTheDocument();
    expect(container.queryByText('Payments')).toBeInTheDocument();
    })
  });
});
