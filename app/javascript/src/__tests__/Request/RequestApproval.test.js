import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../containers/Provider/AuthStateProvider';
import { createClient } from '../../utils/apollo';
import RequestApproval from '../../containers/Requests/RequestApproval';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
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
    let container;
    await act(async () => {
      container =  render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data}>
            <MockedProvider>
              <BrowserRouter>
                <RequestApproval />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
        );
      });
      await waitFor(() => {
          expect(container.queryByText('Ok')).toBeInTheDocument()
      })
  });
});
