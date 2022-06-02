import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import Home from '../Components/Home';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Home main page', () => {
  it('renders the home main correctly', async () => {
    await act(async () => {
      render(
        <Context.Provider value={authState}>
          <MockedProvider mocks={[]} addTypename={false}>
            <BrowserRouter>
              <MockedThemeProvider>
                <Home />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );
    });
  });
});

describe('Admin home page', () => {
  it('renders quick links by role', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[]} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <Home />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      const quickLinks = screen.queryAllByTestId('link-name');
      expect(quickLinks[0]).toBeInTheDocument();
    }, 10);
  });
});

describe('Client home page', () => {
  it('renders client quick links by role', async () => {
    const menuItems = [
      {
        menu_link: 'https://example.com',
        menu_name: 'Quick Link 1',
        display_on: ['Dashboard', 'Menu'],
        roles: ['admin', 'client']
      },
      {
        menu_link: 'https://example.com',
        menu_name: 'Quick Link 1',
        display_on: ['Dashboard', 'Menu'],
        roles: ['admin']
      }
    ];

    const updatedAuth = {
      ...authState,
      user: {
        ...authState.user,
        userType: 'client',
        community: {
          ...authState.user.community,
          menuItems
        }
      }
    };
    render(
      <Context.Provider value={updatedAuth}>
        <MockedProvider mocks={[]} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <Home />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      const quickLinks = screen.queryAllByTestId('link-name');
      expect(quickLinks[0]).toBeInTheDocument();
      expect(quickLinks).toHaveLength(1);
    }, 10);
  });
});
