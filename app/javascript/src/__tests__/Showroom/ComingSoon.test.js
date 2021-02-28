import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import ComingSoon from '../../containers/showroom/ComingSoon';

describe('ComingSoon Component', () => {
  it('renders ComingSoon texts', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <ComingSoon />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByText(/Thanks for coming in! Our team will help/)).toBeInTheDocument();
  });
});
