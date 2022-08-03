import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import EmployeeLogs from '../Components/EmployeeLogs';

describe('EmployeeLogs Component', () => {
  it('renders loader when loading records', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <EmployeeLogs />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() =>expect(container.queryByTestId('loader')).toBeInTheDocument())
  });
});
