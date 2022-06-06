import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Payments from '../../modules/Payments/Components/Payments';
import { Context } from '../../containers/Provider/AuthStateProvider';
import userMock from '../../__mocks__/userMock';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('Payments Component', () => {
  it('renders Payments text', async () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <Payments />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(container.queryAllByText('search.search_for')[0]).toBeInTheDocument();
      expect(container.queryAllByText('common:misc.add_filter')[0]).toBeInTheDocument();
      expect(container.queryAllByText('Add group')[0]).toBeInTheDocument();
      expect(container.queryAllByText('misc.previous')[0]).toBeInTheDocument();
      expect(container.queryAllByText('misc.next')[0]).toBeInTheDocument();
    }, 10);
  });
});
