import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import GuestUpdate from '../containers/GuestUpdate';
import GuestRequestForm from '../Components/GuestRequestForm';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('RequestUpdate main page', () => {
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
it('renders the GuestRequestForm page correctly', async () => {
    await act(async () => {
      render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data}>
            <MockedProvider>
              <BrowserRouter>
                <GuestRequestForm id="23942342dsd" />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
        );
      });
  });
  it('renders the GuestUpdate page correctly', async () => {
    await act(async () => {
      render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data}>
            <MockedProvider>
              <BrowserRouter>
                <GuestUpdate />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
        );
      });
  });
});
