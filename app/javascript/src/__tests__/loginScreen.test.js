import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import LoginScreen from '../components/AuthScreens/LoginScreen'
import { loginEmailMutation, loginPhoneMutation } from '../graphql/mutations'
import { CurrentCommunityQuery } from '../modules/Community/graphql/community_query';
import { AUTH_FORWARD_URL_KEY } from '../utils/apollo';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ location: { search: '?next=/tasks' } }),
  useLocation: () => ({ state: { from: { pathname: '/tasks' } } })
}));

describe('Login Screen', () => {
  const { sessionStorage } = window;
  const assignMock = jest.fn()

  beforeAll(() => {
    delete window.sessionStorage;
    delete window.location;
    window.sessionStorage = {
      getItem: jest.fn(() => '/tasks'),
      setItem: jest.fn()
    };
    window.location = { assign: assignMock };
  });
  afterAll(() => {
    window.sessionStorage = sessionStorage;
    assignMock.mockClear()
  });
  const mocks = [
    {
      request: {
        query: loginPhoneMutation,
        variables: { phoneNumber: '26000000748' }
      },
      result: {
        data: {
          loginPhoneStart: {
            id: '11cdad78-5a04-4026-828c-17290a2c44b6',
            phoneNumber: '26000000748',
          }
        }
      }
    },
    {
      request: {
        query: CurrentCommunityQuery
      },
      result: {
        data: {
          currentCommunity: {
            imageUrl: 'https://dev.dgdp.site/rails/active_storage/blobs/eyJ.png',
            id: '8d66a68a-ded4-4f95-b9e2-62811d2f395f',
            name: 'Test Community',
            supportEmail: [{email: 'support@test.com', category: 'customer_care'}],
            supportWhatsapp: [{email: 'support@test.com', category: 'customer_care'}],
            supportNumber: [{email: 'support@test.com', category: 'customer_care'}],
            currency: 'kwacha',
            locale: 'en-ZM',
            tagline: 'This is a tagline for this community',
            logoUrl: '',
            language: 'en-US',
            wpLink: '',
            themeColors: {
              primaryColor: "#FFFFFF",
              secondaryColor: "#FFFFFF"
            },
            features: { Dashboard: { features: [] }},
            securityManager: '000000',
          }
        }
      }
    }
  ]

  it('renders correctly', async () => {
    const loginWrapper = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <LoginScreen />
        </BrowserRouter>
      </MockedProvider>
      )

    expect(loginWrapper.queryByText('login.login_text')).toBeInTheDocument()
    expect(loginWrapper.queryByTestId('tagline')).toBeInTheDocument()
    expect(loginWrapper.getByPlaceholderText('common:form_placeholders.phone_number')).toBeInTheDocument()
    expect(loginWrapper.queryByTestId('email_text_input')).toBeInTheDocument()
    expect(loginWrapper.queryAllByText('common:misc:or').length).toBeGreaterThan(0)
    expect(loginWrapper.queryByText('login.login_google')).toBeInTheDocument()
    expect(loginWrapper.queryByText('login.login_facebook')).toBeInTheDocument()
    expect(loginWrapper.queryByText('login.login_button_text')).toBeInTheDocument()
    expect(loginWrapper.queryByTestId('login-btn')).toBeInTheDocument()
    expect(loginWrapper.queryByTestId('trouble-logging-div')).toBeInTheDocument()
    expect(loginWrapper.queryByTestId('trouble-logging-in-btn')).toBeInTheDocument()
    expect(loginWrapper.queryByText('login.request_account')).toBeInTheDocument()

    fireEvent.change(loginWrapper.getByPlaceholderText('common:form_placeholders.phone_number'), {
      target: { value: '12345' }
    });
    expect(loginWrapper.getByPlaceholderText('common:form_placeholders.phone_number').value).toBe('+1 (234) 5');

    fireEvent.change(loginWrapper.getByPlaceholderText('login.login_email'), {
      target: { value: 'example@example.com' }
    });
    expect(loginWrapper.getByPlaceholderText('login.login_email').value).toBe('example@example.com');

    fireEvent.click(loginWrapper.queryByTestId('trouble-logging-in-btn'));

    expect(loginWrapper.getByText('common:form_fields.full_name')).toBeInTheDocument()
    expect(loginWrapper.getByText('common:form_fields.email')).toBeInTheDocument()
    expect(loginWrapper.getByText('common:form_fields.phone_number')).toBeInTheDocument()
    expect(loginWrapper.queryByTestId('interest')).toBeInTheDocument()
    expect(loginWrapper.queryByTestId('impact')).toBeInTheDocument()
    expect(loginWrapper.getByText('common:form_actions.send_email')).toBeInTheDocument()
  });

  it('should trigger login with email', async () => {
    const mock = [
      ...mocks,
      {
        request: {
          query: loginEmailMutation,
          variables: { email: 'admin@example.com' }
        },
        result: {
          data: {
            loginEmail: {
              id: '11cdad78-5a04-4026-828c-17290a2c44b6',
            }
          }
        }
      },
    ]

    render(
      <MockedProvider mocks={mock} addTypename={false}>
        <BrowserRouter>
          <LoginScreen />
        </BrowserRouter>
      </MockedProvider>
    )

    await waitFor(async () => {
      const loginTextField = screen.getByPlaceholderText('login.login_email')
      expect(loginTextField).toBeInTheDocument();
      
      fireEvent.change(loginTextField, {
        target: { value: 'admin@example.com' }
      });
      
      const loginBtn = screen.queryByTestId('login-btn')
      expect(loginBtn).toBeInTheDocument();
      fireEvent.click(loginBtn)
    }, 10)
  });

  it('should trigger google oauth button and persist in sessionStorage', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <LoginScreen />
        </BrowserRouter>
      </MockedProvider>
    )

    await waitFor(async () => {
      const googleLoginUrl = '/login_oauth'
      const googleLoginBtn = screen.queryByTestId('login-with-google-btn')
      expect(googleLoginBtn).toBeInTheDocument();
      
      fireEvent.click(googleLoginBtn)

      expect(window.sessionStorage.getItem(AUTH_FORWARD_URL_KEY)).toEqual('/tasks')
      expect(assignMock).toHaveBeenCalledWith(googleLoginUrl)
    }, 10)
  });

  it('should trigger facebook oauth button and persist in sessionStorage', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <LoginScreen />
        </BrowserRouter>
      </MockedProvider>
    )

    await waitFor(async () => {
      const fbLoginUrl = '/fb_oauth'
      const fbLoginBtn = screen.queryByTestId('login-with-facebook-btn')
      expect(fbLoginBtn).toBeInTheDocument();
      
      fireEvent.click(fbLoginBtn)

      expect(window.sessionStorage.getItem(AUTH_FORWARD_URL_KEY)).toEqual('/tasks')
      expect(assignMock).toHaveBeenCalledWith(fbLoginUrl)
    }, 10)
  });
});
