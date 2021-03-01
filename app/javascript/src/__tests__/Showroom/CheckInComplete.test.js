import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import CheckInComplete from '../../containers/showroom/CheckInComplete';

describe('CheckInComplete Component', () => {
  it('renders CheckInComplete texts', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CheckInComplete />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByText(/Thank You for Checking In/)).toBeInTheDocument();
    expect(container.getByText(/Check-In Another Visitor/)).toBeInTheDocument();
  });
});
