import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import Home from '../Components/Home';
import userMock from '../../../__mocks__/userMock';

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
