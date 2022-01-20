import React from "react";
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import Home from '../Components/Home';
import userMock from '../../../__mocks__/userMock';
import authState from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Home main page', () => {
  it('renders the home main correctly', async () => {
    await act(async () => {
      render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={userMock}>
            <MockedProvider mocks={[]} addTypename={false}>
              <BrowserRouter>
                <Home />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
      );
    });
  });
});

describe('Admin home page', () => {
  it('renders quick links by role', async () => {
    render(
      <ApolloProvider client={createClient}>
        <Context.Provider value={authState}>
          <MockedProvider mocks={[]} addTypename={false}>
            <BrowserRouter>
              <Home />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      </ApolloProvider>
    );
    const quickLinks = screen.queryAllByTestId('link-name');
    expect(quickLinks[0]).toBeInTheDocument();
  });
});

describe('Client home page', () => {
  it('renders client quick links by role', async () => {
    const menuItems = [
      {
        menu_link: "https://example.com",
        menu_name: "Quick Link 1",
        display_on: ['Dashboard', 'Menu'],
        roles: ['admin', 'client']
      },
      {
        menu_link: "https://example.com",
        menu_name: "Quick Link 1",
        display_on: ['Dashboard', 'Menu'],
        roles: ['admin']
      },
    ]

    const updatedAuth = {
      ...authState,
      user: {
        ...authState.user,
        userType: "client",
        community: {
          ...authState.user.community,
          menuItems
        }
      }
    }
    render(
      <ApolloProvider client={createClient}>
        <Context.Provider value={updatedAuth}>
          <MockedProvider mocks={[]} addTypename={false}>
            <BrowserRouter>
              <Home />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      </ApolloProvider>
    );
    const quickLinks = screen.queryAllByTestId('link-name');
    expect(quickLinks[0]).toBeInTheDocument();
    expect(quickLinks).toHaveLength(1);
  });
});
