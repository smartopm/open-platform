import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Payments from '../../containers/Payment/Payments';

describe('Payments Component', () => {
  it('renders Payments text', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Payments />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByText(/Invoices/)).toBeInTheDocument();
  });
});
