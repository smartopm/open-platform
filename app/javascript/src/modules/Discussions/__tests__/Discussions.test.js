import React from 'react';
import { act, render, waitFor, fireEvent } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { DiscussionsQuery } from '../../../graphql/queries';
import Discussions from '../Containers/Discussions';
import { Context } from '../../../containers/Provider/AuthStateProvider'
import userMock from '../../../__mocks__/authstate'

describe('Discussions Component', () => {
  it('renders Discussion elements', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Discussions />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('loader')).toBeInTheDocument();
    }, 1)
  });

  it('should display neccesary elements after fetching discussions', async () => {
    const mocks = [
      {
        request: {
          query: DiscussionsQuery,
          variables: {
            limit: 20
          }
        },
        result: {
          data: {
            discussions: [{
              id: '1gdghs',
              title: 'MY Discussion',
              description: 'My Description',
              createdAt: '2021-01-01',
              user: {
                id: '1gye',
                name: 'Nurudeen',
                imageUrl: 'https://imgae.png',
                avatarUrl: 'https://imgae.png'
              }
            }]
          }
        }
      }
    ];

    let container;
    await act(async () => {
      container = render(
        <Context.Provider value={userMock}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <BrowserRouter>
              <Discussions />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );
    });

    await waitFor(() => {
      expect(container.getByText(/MY Discussion/)).toBeInTheDocument();
      expect(container.getByText(/Nurudeen/)).toBeInTheDocument();
      expect(container.getByText(/My Description/)).toBeInTheDocument();

      fireEvent.click(container.queryAllByText('headers.create_discussion')[0])
      expect(container.queryAllByText('headers.create_discussion')[1]).toBeInTheDocument();
    }, 10)
  });

  it('should display no discussions if no result is fetched', async () => {
    const mocks = [
      {
        request: {
          query: DiscussionsQuery,
          variables: {
            limit: 20
          }
        },
        result: {
          data: {
            discussions: []
          }
        }
      }
    ];

    let container;
    await act(async () => {
      container = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <Discussions />
          </BrowserRouter>
        </MockedProvider>
      );
    });
    await waitFor(() => {
      expect(container.getByText('headers.no_discussions')).toBeInTheDocument();
    }, 5)
  });
});
