import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import { AllEntryRequestsQuery } from '../../../graphql/queries';
import { AllEntryRequests, UserComponent } from '../Components/EntryRequests';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('requestlist main page', () => {
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
  it('renders the requests page correctly', async () => {
    const mocks = [
      {
        request: {
          query: AllEntryRequestsQuery
        },
        result: {
          data: {
            result: [
              {
                id: '647e9c06-b0dd-43f2-bbfa-11ebd91c39f9',
                name: 'Joe de',
                phoneNumber: '30948342',
                nrc: '309435',
                vehiclePlate: '234',
                reason: null,
                otherReason: null,
                concernFlag: null,
                grantedState: 1,
                createdAt: '2020-10-15T09:25:10Z',
                updatedAt: '2020-10-15T09:25:21Z',
                grantedAt: '2020-10-15T09:25:21Z',
                guard: {
                  name: 'J oher',
                  id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
                }
              }
            ]
          }
        }
      }
    ];

    let container;
    await act(async () => {
      container = render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <BrowserRouter>
                <AllEntryRequests />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
      );
    });

    await waitFor(() => {
      expect(container.queryByText('Granted')).toBeInTheDocument();
      expect(container.queryByText('Joe de')).toBeInTheDocument();
      expect(container.queryByText('J oher')).toBeInTheDocument();
      expect(container.queryByText('30948342')).toBeInTheDocument();
      expect(container.queryByText('309435')).toBeInTheDocument();
      expect(container.queryByText('234')).toBeInTheDocument();
    }, 50);
  });

  it('should display error when the query fails', async () => {
    const mocks = [
      {
        request: {
          query: AllEntryRequestsQuery
        },
        error: new Error('Something wrong happened')
      }
    ];

    let container;
    await act(async () => {
      container = render(
        <ApolloProvider client={createClient}>
          <Context.Provider value={data}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <BrowserRouter>
                <AllEntryRequests />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        </ApolloProvider>
      );
    });
    await waitFor(() => {
      expect(container.queryByText('Network error: Something wrong happened')).toBeInTheDocument();
      expect(container.queryByText('Home')).toBeInTheDocument();
    }, 50);
  });
  it('check the extra user component in requests', () => {
    const otherData = {
      entryLogs: [
        {
          reportingUser: {
            name: 'Joe Di'
          },
          createdAt: '2020-10-15T09:25:10Z'
        }
      ]
    };
    
    const container = render(
      <ApolloProvider client={createClient}>
        <Context.Provider value={data}>
          <MockedProvider mocks={[]} addTypename={false}>
            <BrowserRouter>
              <UserComponent data={otherData} />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      </ApolloProvider>
    );

    expect(container.queryByText('Joe Di')).toBeInTheDocument();
  });
});
