import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import BussinessList from '../Components/Businesses';

describe('Business Component', () => {
  it('renders loader when loading businesses', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <BussinessList />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
