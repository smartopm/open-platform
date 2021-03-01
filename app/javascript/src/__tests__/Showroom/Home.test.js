import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Home from '../../containers/showroom/Home';

describe('Home Component', () => {
  it('renders Home texts', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByText(/Welcome to Thebe Investment Management/)).toBeInTheDocument();
    expect(container.getByText(/Press Here to Check-In/)).toBeInTheDocument();
  });
});
