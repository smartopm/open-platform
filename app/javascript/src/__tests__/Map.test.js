import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../containers/Provider/AuthStateProvider';
import { createClient } from '../utils/apollo';
import Map from '../containers/Map';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Map page', () => {
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
  it('renders Map correctly', async () => {
    render(
      <ApolloProvider client={createClient}>
        <Context.Provider value={data}>
          <MockedProvider mocks={[]} addTypename={false}>
            <BrowserRouter>
              <Map />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      </ApolloProvider>
    );

    await waitFor(() => expect(screen.queryByTestId('loader')).toBeInTheDocument())
  });
});
