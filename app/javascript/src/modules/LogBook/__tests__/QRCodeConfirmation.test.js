import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import QRCodeConfirmation from '../Components/QRCodeConfirmation';

describe('Should render QRCodeConfirmation Component', () => {
  const sendQrCode = jest.fn();
  const closeModal = jest.fn();
  const emailHandler = {
    value: '',
    handleEmailChange: jest.fn()
  };
  const guestRequest = {
    id: 'a91dbad4-eeb4'
  };

  it('should render proper data', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <QRCodeConfirmation
              open
              guestEmail="email@gmail.com"
              emailHandler={emailHandler}
              sendQrCode={sendQrCode}
              guestRequest={guestRequest}
              closeModal={closeModal}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByTestId('confirmation-dialog-title')).toBeInTheDocument();
    expect(container.queryByTestId('dont-send-confirmation')).toBeInTheDocument();
    expect(container.queryByTestId('send-confirmation')).toBeInTheDocument();
    expect(container.queryByTestId('guest-email')).toBeInTheDocument();
  });

  it('should render text-input for a new email if guest does not have an email', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <QRCodeConfirmation
              open
              guestEmail={null}
              emailHandler={emailHandler}
              sendQrCode={sendQrCode}
              guestRequest={guestRequest}
              closeModal={closeModal}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('guest-email')).not.toBeInTheDocument();
    expect(container.queryByTestId('guest-email-input')).toBeInTheDocument();

    const emailInput = container.queryByTestId('guest-email-input');
    fireEvent.change(emailInput, { target: { value: 'someemail@gmail.com' } });
    expect(emailHandler.handleEmailChange).toBeCalled();
  });
});
