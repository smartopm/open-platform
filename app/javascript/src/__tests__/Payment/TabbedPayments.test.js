import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import TabbedPayments from '../../modules/Payments/Components/TabbedPayments';
import userMock from '../../__mocks__/userMock';
import { Context } from '../../containers/Provider/AuthStateProvider';

describe('Tabbed Payment Component', () => {
  it('renders Tabbed Payment Templates', async () => {
    await act(async () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider>
          <BrowserRouter>
            <TabbedPayments authState={userMock} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.queryByText('Invoices')).toBeInTheDocument();
    expect(container.queryByText('Payments')).toBeInTheDocument();
    })
  });
});
