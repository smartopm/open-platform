import React from 'react';
import { render, act } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import TabbedPayments from '../../modules/Payments/Components/TabbedPayments';
import userMock from '../../__mocks__/userMock';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';
import { Context } from '../../containers/Provider/AuthStateProvider';

describe('Tabbed Payment Component', () => {
  it('renders Tabbed Payment Templates', async () => {
    // No tabs anymore, just check if this renders without crashing
    await act(async () => {
      render(
        <Context.Provider value={userMock}>
          <MockedProvider>
            <BrowserRouter>
              <MockedThemeProvider>
                <TabbedPayments authState={userMock} />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );
    });
  });
});
