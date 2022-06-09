import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import BusProfile from '../Components/BusinessProfilePage';

describe('Feedback Component', () => {
  it('renders loader when loading feedback', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <BusProfile />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
