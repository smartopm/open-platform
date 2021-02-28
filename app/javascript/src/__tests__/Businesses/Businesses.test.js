import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Buss from '../../containers/Businesses/Businesses';

describe('Business Component', () => {
  it('renders loader when loading businesses', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Buss />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
