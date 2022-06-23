import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import RouteData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import UserMessagePage from '../../containers/Messages/UserMessagePage';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('AllMessages Component', () => {
  const mockParams = {
    id: '123',
  }
  beforeEach(() => {
    jest.spyOn(RouteData, 'useParams').mockReturnValue(mockParams)
  });
  it('renders UserMessagePage text', async () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <MockedThemeProvider>
            <UserMessagePage />
          </MockedThemeProvider>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(screen.queryByTestId('loader')).toBeInTheDocument()
    expect(screen.queryByText('common:misc.count')).toBeInTheDocument()
    expect(screen.queryByText('common:misc.send')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Home')).toBeInTheDocument()
    }, 5);
  });
});
