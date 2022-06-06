import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Campaigns from '../containers/Campaigns';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Campaigns Component', () => {
  it('renders Campaigns text', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Campaigns />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() =>  expect(screen.queryByTestId('loader')).toBeInTheDocument())
  });
});
