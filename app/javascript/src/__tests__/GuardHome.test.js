import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../containers/Provider/AuthStateProvider';
import { createClient } from '../utils/apollo';
import { SecurityGuards } from '../graphql/queries';
import { HomeGuard as GuardHome } from '../containers/GuardHome';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Home  Guard page', () => {
  const data = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'client',
      expiresAt: null,
      community: {
        supportName: 'Support Officer'
      }
    }
  };
  it('renders the guard home page correctly', async () => {
    const mocks = [
      {
        request: {
          query: SecurityGuards
        },
        result: {
          data: {
            securityGuards: [
                {
                    name: "guard 1",
                    id: "2743-4232e2-23ewed2",
                    phoneNumber: "00909898392",
                }
            ]
          }
        }
      }
    ];

    const tMock = jest.fn();
    let container;
    await act(async () => {
      container = render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data.user}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <BrowserRouter>
                <GuardHome translate={tMock} />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
      );
    });

    expect(container.queryByTestId('loader')).toBeInTheDocument()
  });

  it('should check for errors occured when fetching ', async () => {
    const mocks = [
        {
          request: {
            query: SecurityGuards
          },
          error: new Error('Something happpened')
        }
      ];

      const tMock = jest.fn();
      let container;
      await act(async () => {
        container = render(
          <ApolloProvider client={createClient}>
            <Context.Provider value={data}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <BrowserRouter>
                  <GuardHome translate={tMock} />
                </BrowserRouter>
              </MockedProvider>
            </Context.Provider>
          </ApolloProvider>
        );
      });

      await waitFor(() => {
        expect(container.queryByText('Network error: Something happpened')).toBeInTheDocument();
      }, 50);
  })
});
