import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import CustodianLogs from '../Components/CustodianLogs';

describe('CustodianLogs Component', () => {
  it('renders loader when loading custodian logs', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CustodianLogs />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => expect(container.queryByTestId('loader')).toBeInTheDocument());
  });
});
