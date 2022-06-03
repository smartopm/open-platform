import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import AllMessages from '../../containers/Messages/AllMessages';

describe('AllMessages Component', () => {
  it('renders loader when loading form', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <AllMessages />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() =>  expect(container.queryByTestId('category-filter')).toBeInTheDocument());
  });
});
