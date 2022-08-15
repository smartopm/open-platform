import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';

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

    expect(container.queryByTestId('loader')).toBeInTheDocument();
    await waitForElementToBeRemoved(container.queryByTestId('loader'));
  });
});
