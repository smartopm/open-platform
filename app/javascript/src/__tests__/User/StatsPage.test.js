import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import StatsPage from '../../modules/CustomerJourney/Components/UserStats';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Stat Page component', () => {
  it('should render correctly', async () => {
    render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <StatsPage />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText('Customer Journey Stage')).toBeInTheDocument()
      expect(screen.queryByTestId('loader')).toBeInTheDocument()
    })
  });
});
