import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { SecurityGuards } from '../graphql/queries';
import { HomeGuard as GuardHome } from '../modules/Dashboard/Components/GuardHome'
import { Context } from '../containers/Provider/AuthStateProvider';
import userMock from '../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Home Guard page', () => {
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
                    id: "11cdad78"
                }
            ]
          }
        }
      }
    ];

    const tMock = jest.fn();
    await act(async () => {
      render(
        <Context.Provider value={userMock}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <BrowserRouter>
              <GuardHome translate={tMock} />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      );
    });
  });

  it('should check for errors occured when fetching', async () => {
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
          <Context.Provider value={userMock}>
            <MockedProvider mocks={mocks} addTypename={false}>
              <BrowserRouter>
                <GuardHome translate={tMock} />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        );
      });

      await waitFor(() => {
        expect(container.queryByText('Network error: Something happpened')).toBeInTheDocument();
      }, 50);
  })
});
