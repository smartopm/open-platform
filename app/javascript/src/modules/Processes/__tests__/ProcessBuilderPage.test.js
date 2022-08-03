/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { Context } from '../../../containers/Provider/AuthStateProvider'
import authState from '../../../__mocks__/authstate'
import ProcessBuilderPage from '../Components/ProcessBuilderPage';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Create Process Form', () => {
  it('renders form to create a process with necessary elements', async () => {
    const adminUser = { userType: 'admin', ...authState }
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <MockedThemeProvider>
              <ProcessBuilderPage />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('process-page-builder')).toBeInTheDocument();
    });
  });
});
