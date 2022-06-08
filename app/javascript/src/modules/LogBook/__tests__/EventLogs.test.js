import React from 'react';
import { render, waitFor } from '@testing-library/react';


import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import EventLogs from '../Components/EventLogs';

describe('EventLogs Component', () => {
  it('renders loader when loading record', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <EventLogs />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => { expect(container.queryByTestId('loader')).toBeInTheDocument() });
  });
});
