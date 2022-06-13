import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import EventLogs from '../Components/EventLogs';

describe('EventLogs Component', () => {
  it('renders loader when loading record', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <EventLogs />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
