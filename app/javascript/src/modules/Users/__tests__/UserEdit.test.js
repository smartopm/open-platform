import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import UserEdit from '../Containers/UserEdit';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('UserEdit page', () => {
  const data = {
    loggedIn: true,
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'admin',
      expiresAt: null,
      community: {
        supportName: 'Support Officer'
      }
    }
  };
  it('renders UserEdit correctly', () => {
    const locationMock = {
      state: {
        from: 'logs'
      },
      pathname: 'edit'
    };
    render(
      <ApolloProvider client={createClient}>
        <Context.Provider value={data}>
          <MockedProvider mocks={[]} addTypename={false}>
            <BrowserRouter>
              <MockedThemeProvider>
                <UserEdit location={locationMock} />
              </MockedThemeProvider>
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      </ApolloProvider>
    );
  });
});
