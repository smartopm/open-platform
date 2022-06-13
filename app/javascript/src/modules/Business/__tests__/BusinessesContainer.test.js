import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import BussinessList from '../Components/Businesses';

describe('Business Component', () => {
  it('renders loader when loading businesses', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <BussinessList />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => expect(container.queryByTestId('loader')).toBeInTheDocument())
  });
});
