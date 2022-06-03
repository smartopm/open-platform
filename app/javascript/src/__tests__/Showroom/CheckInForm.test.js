import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import CheckInForm from '../../containers/showroom/CheckInForm';

describe('CheckInForm Component', () => {
  it('renders CheckInForm texts', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CheckInForm />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByText(/Nkwashi Showroom Check-In/)).toBeInTheDocument();
    expect(container.getByText(/Please enter your contact information below/)).toBeInTheDocument();
  });
});
