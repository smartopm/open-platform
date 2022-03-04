import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import GuestQRPage, { GuestQRCode } from '../Components/GuestQRPage';

describe('Guest QRPage Component',  () => {
  it('renders GuestQRPage component', () => {
    render(
      <Context.Provider value={authState}>
        <GuestQRPage
          match={{params: {id: 'd6765-b10e-4865-bee7'}}}
        />
      </Context.Provider>
    );
    expect(screen.queryByText('guest.qr_code')).toBeInTheDocument();
    expect(screen.queryByText('John Doctor')).toBeInTheDocument();
  });

  it('renders GuestQRCode component', () => {
    const data = {
      user: {
        id: 'a54d6184-b10e-4865-bee7-7957701d423d',
        name: 'John Doe',
        userType: 'visitor',
      }
    };

    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Context.Provider value={authState}>
            <GuestQRCode
              data={data}
              requestId="d6765-b10e-4865-bee7"
            />
          </Context.Provider>
        </BrowserRouter>
      </MockedProvider>
    );
      expect(container.queryByText('guest.qr_code')).toBeInTheDocument();
      expect(container.queryByText('John Doe')).toBeInTheDocument();
  });

});