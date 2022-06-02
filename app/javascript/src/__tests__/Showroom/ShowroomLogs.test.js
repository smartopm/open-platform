import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import ShowroomLogs from '../../containers/showroom/ShowroomLogs';

describe('Home Component', () => {
  it('renders Home texts', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <ShowroomLogs />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => expect(container.queryByTestId('loader')).toBeInTheDocument());
  });
});
