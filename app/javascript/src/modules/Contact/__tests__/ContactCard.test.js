import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import SupportCard from '../Components/SupportCard';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Contact page', () => {
  const authState = {
    loaded: true,
    loggedIn: true,
    setToken: jest.fn(),
    user: {
      avatarUrl: null,
      community: { name: 'Nkwashi', supportNumber: [], supportEmail: [] },
      email: '9753942',
      expiresAt: null,
      id: '11cdad78',
      imageUrl: null,
      name: 'John Doctor',
      phoneNumber: '260971500748',
      userType: 'security_guard'
    }
  };

  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <SupportCard handleSendMessage={jest.fn()} user={authState.user} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
  });

  it('clicks pay with mobile money then opens use window', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <SupportCard handleSendMessage={jest.fn()} user={authState.user} />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    const button = getByTestId('pwmm');
    expect(button).toBeTruthy();
  });

  it('clicks pay with mobile money use window', () => {
    window.open = jest.fn();
    const { getAllByTestId } = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <SupportCard handleSendMessage={jest.fn()} user={authState.user} />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    const payWithMoMo = getAllByTestId('pwmm');
    expect(payWithMoMo[0].textContent).toContain('buttons.pay_with_mobile_money');
  });

  it('clicks privacy and terms of service', () => {
    window.open = jest.fn();
    const { getByTestId } = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <SupportCard handleSendMessage={jest.fn()} user={authState.user} />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    const tos = getByTestId('tos');
    expect(tos.textContent).toContain('buttons.privacy_and_terms');
  });

  afterEach(cleanup);
});
