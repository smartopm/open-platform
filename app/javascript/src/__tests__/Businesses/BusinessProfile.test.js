import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import BusProfile from '../../containers/Businesses/BusinessProfile';

describe('Feedback Component', () => {
  it('renders loader when loading feedback', () => {
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
