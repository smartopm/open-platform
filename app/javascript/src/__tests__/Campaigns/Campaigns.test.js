import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Campaigns from '../../containers/Campaigns/Campaigns';

describe('Campaigns Component', () => {
  it('renders Campaigns text', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Campaigns />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByText(/Campaigns/)).toBeInTheDocument();
  });
});