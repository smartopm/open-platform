import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import AllNotes from '../../containers/Activity/AllNotes';


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Feedback Component', () => {
  it('renders loader when loading notes', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <AllNotes />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>  expect(container.queryByTestId('loader')).toBeInTheDocument())
  });
});
