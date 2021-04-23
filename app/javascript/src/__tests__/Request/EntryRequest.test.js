import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../containers/Provider/AuthStateProvider';
import { createClient } from '../../utils/apollo';
import EntryRequest from '../../containers/Requests/EntryRequest';

describe('EntryRequest main page', () => {
  const data = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'client',
      expiresAt: null,
      community: {
        supportName: "Support Officer"
      }
    }
  };
it('renders the EntryRequest page correctly', async () => {
    await act(async () => {
      render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data}>
            <MockedProvider>
              <BrowserRouter>
                <EntryRequest />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
        );
      });
  });
});
