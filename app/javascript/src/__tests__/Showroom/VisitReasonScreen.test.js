import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import VisitReasonScreen from '../../containers/showroom/VisitReasonScreen';

describe('CheckInComplete Component', () => {
  it('renders CheckInComplete texts', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <VisitReasonScreen />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByText(/Why are you here today/)).toBeInTheDocument();
    expect(container.getByText(/Visiting the Nkwashi Showroom/)).toBeInTheDocument();
  });
});
