import React from 'react';
import { render, screen } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Homepage from '../components/HomePage';
import MockedThemeProvider from '../modules/__mocks__/mock_theme';

describe('HomePage component', () => {
  const adminAuthState = {
    loaded: true,
    loggedIn: true,
    setToken: jest.fn(),
    user: {
      avatarUrl: null,
      community: { name: 'Nkwashi', wpLink: 'https://wordpress.com' },
      email: '9753942',
      expiresAt: null,
      id: '11cdad78',
      imageUrl: null,
      name: 'John Doctor',
      phoneNumber: '260971500000',
      userType: 'admin'
    }
  };
  const quickLinks = [{ menu_name: 'Report an Issue', menu_link: 'https://report.com' }];

  it('should render without error and have all cards for admins', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Homepage authState={adminAuthState} quickLinks={quickLinks} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('dashboard.my_id_card')).toBeInTheDocument();
    expect(container.queryByText('common:misc.users')).toBeInTheDocument();
    expect(container.queryByText('common:misc.campaigns')).toBeInTheDocument();
    expect(container.queryByText('common:misc.notes')).toBeInTheDocument();
    expect(container.queryByText('common:misc.time_card')).toBeInTheDocument();
    expect(container.queryByText('common:misc.tasks')).toBeInTheDocument();
    expect(container.queryByText('common:misc.labels')).toBeInTheDocument();
  });

  it('should render without error and have all cards for custodian', () => {
    const custodianAuthState = {
      loaded: true,
      loggedIn: true,
      setToken: jest.fn(),
      user: {
        avatarUrl: null,
        community: { name: 'Nkwashi', wpLink: 'https://wordpress.com' },
        email: '9753942',
        expiresAt: null,
        id: '11cdad78',
        imageUrl: null,
        name: 'John Doctor',
        phoneNumber: '260971500000',
        userType: 'custodian'
      }
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Homepage authState={custodianAuthState} quickLinks={quickLinks} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('dashboard.my_messages')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.campaigns')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.notes')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.time_card')).toBeInTheDocument();
    expect(container.queryByText('common:misc.tasks')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.log_book')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.users')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.labels')).not.toBeInTheDocument();
  });
  it('should render without error and have all cards for client', () => {
    const clientAuthState = {
      loaded: true,
      loggedIn: true,
      setToken: jest.fn(),
      user: {
        avatarUrl: null,
        community: { name: 'Nkwashi', wpLink: 'https://wordpress.com' },
        email: '9753942',
        expiresAt: null,
        id: '11cdad78',
        imageUrl: null,
        name: 'John Doctor',
        phoneNumber: '260971500000',
        userType: 'client'
      }
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Homepage authState={clientAuthState} quickLinks={quickLinks} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('dashboard.my_messages')).toBeInTheDocument();
    expect(container.queryByText('common:misc.campaigns')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.notes')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.time_card')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.tasks')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.log_book')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.users')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.referrals')).toBeInTheDocument();
    expect(container.queryByText('common:misc.labels')).not.toBeInTheDocument();
  });

  it('should render without error and have all cards for prospective client', () => {
    const prospectAuthState = {
      loaded: true,
      loggedIn: true,
      setToken: jest.fn(),
      user: {
        avatarUrl: null,
        community: { name: 'Nkwashi', wpLink: 'https://wordpress.com' },
        email: '9753942',
        expiresAt: null,
        id: '11cdad78',
        imageUrl: null,
        name: 'John Doctor',
        phoneNumber: '260971500000',
        userType: 'prospective_client'
      }
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Homepage authState={prospectAuthState} quickLinks={quickLinks} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('dashboard.my_messages')).toBeInTheDocument();
    expect(container.queryByText('common:misc.campaigns')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.notes')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.time_card')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.tasks')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.log_book')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.users')).not.toBeInTheDocument();
    expect(container.queryByText('common:misc.referrals')).not.toBeInTheDocument();
  });

  // check for the window.open

  it('should not contain any non security_guard cards', () => {
    const guardAuthState = {
      loaded: true,
      loggedIn: true,
      setToken: jest.fn(),
      user: {
        avatarUrl: null,
        community: { name: 'Nkwashi', wpLink: 'https://wordpress.com' },
        email: '9753942',
        expiresAt: null,
        id: '11cdad78',
        imageUrl: null,
        name: 'John Doctor',
        phoneNumber: '260971500000',
        userType: 'security_guard'
      }
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Homepage authState={guardAuthState} quickLinks={quickLinks} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container.queryByText('common:misc.tasks')).toBeNull();
    expect(container.queryByText('common:misc.log_book')).toBeNull();
    expect(container.queryByText('common:misc.users')).toBeNull();
    expect(container.queryByText('common:misc.referrals')).toBeNull();
  });

  describe('Residents dashboard', () => {
    const clientAuthState = {
      loaded: true,
      loggedIn: true,
      setToken: jest.fn(),
      user: {
        avatarUrl: null,
        community: {
          name: 'Nkwashi',
          menuItems: [
            {
              menu_link: 'https://some-link',
              menu_name: 'Custom Menu',
              display_on: ['Dashboard'],
              roles: ['resident']
            }
          ],
          wpLink: 'https://wordpress.com'
        },
        email: '9753942',
        expiresAt: null,
        id: '11cdad78',
        imageUrl: null,
        name: 'John Doctor',
        phoneNumber: '260971500000',
        userType: 'resident'
      }
    };
    it('renders quick links for residents', () => {
      render(
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <Homepage
                authState={clientAuthState}
                quickLinks={clientAuthState.user.community.menuItems}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );
      const links = screen.queryAllByTestId('link-name');

      expect(links[0]).toBeInTheDocument();
    });
    it('renders no task menu for code scanner', () => {
      const scanner = {
        user: {
          userType: 'resident',
          community: {
            name: 'Nkwashi',
            menuItems: [
              {
                menu_link: 'https://some-link',
                menu_name: 'Custom Menu',
                display_on: ['Dashboard'],
                roles: ['resident']
              }
            ],
            wpLink: 'https://wordpress.com'
          }
        }
      };
      render(
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <Homepage authState={scanner} quickLinks={scanner.user.community.menuItems} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );
      expect(screen.queryByText('common:misc.tasks')).toBeNull();
    });
  });
});
