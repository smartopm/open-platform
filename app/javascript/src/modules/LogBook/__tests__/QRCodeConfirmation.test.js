import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import QRCodeConfirmation from '../Components/QRCodeConfirmation';

describe('Should render QRCodeConfirmation Component', () => {
  it('should render proper data', async() => {
    const sendQrCode = jest.fn();
    const closeModal = jest.fn();
    const emailHandler = {
      value: '',
      handleEmailChange: jest.fn(),
    }
    const guestRequest = {
      id: 'a91dbad4-eeb4'
    }
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <QRCodeConfirmation open guestEmail="email@gmail.com" emailHandler={emailHandler} sendQrCode={sendQrCode} guestRequest={guestRequest} closeModal={closeModal} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByTestId('confirmation-dialog-title')).toBeInTheDocument()
    expect(container.queryByTestId('dont-send-confirmation')).toBeInTheDocument()
    expect(container.queryByTestId('send-confirmation')).toBeInTheDocument()
  });
});
