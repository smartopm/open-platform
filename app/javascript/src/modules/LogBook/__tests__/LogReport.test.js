import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import LogReport from '../Components/LogReport';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('LogReport Component', () => {
  it('renders LogReport component correctly', async () => {
    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <LogReport />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('log_stats')).toBeInTheDocument();
      expect(container.queryByTestId('gate_flow_report')).toBeInTheDocument();
    });
  });
});
