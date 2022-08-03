import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import CommunitySettings from '../components/SettingsPage';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Feedback Component', () => {
  it('renders loader when loading settings', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CommunitySettings />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => expect(container.queryByTestId('loader')).toBeInTheDocument());
  });
});
