import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Payments from '../../modules/Payments/Components/Payments';
import { Context } from '../../containers/Provider/AuthStateProvider';
import userMock from '../../__mocks__/userMock';

describe('Payments Component', () => {
  it('renders Payments text', () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider>
          <BrowserRouter>
            <Payments />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getAllByText(/Invoices/)[0]).toBeInTheDocument();
  });
});
