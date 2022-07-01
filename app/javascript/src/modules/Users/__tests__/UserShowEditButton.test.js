import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import ReactRouter from 'react-router';
import UserShow from '../Containers/UserShow';
import { UserQuery, UserAccountQuery } from '../../../graphql/queries';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Renders UserShow', () => {
  jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: '123' });
  const mocks = [
    {
      request: {
        query: UserQuery,
        variables: { id: '123' }
      },
      result: {
        data: {
          user: {
            id: '123',
            name: 'some user',
            contactInfos: null,
            substatusLogs: null,
            formUsers: null,
            labels: null,
            notes: [],
            imageUrl: null,
            avatarUrl: null,
            accounts: null,
            extRefId: null,
            address: null,
            subStatus: null,
            email: null,
            expiresAt: null,
            state: null,
            requestReason: null,
            vehicle: null,
            roleName: null,
            phoneNumber: null,
            lastActivityAt: null,
            userType: 'client',
            status: 'active'
          }
        }
      }
    },
    {
      request: {
        query: UserAccountQuery,
        variable: {
          id: '123'
        }
      },
      result: {
        data: {
          user: {
            id: '123',
            accounts: [
              {
                id: '456',
                updatedAt: '2021-11-15T15:41:42+02:00',
                landParcels: [
                  {
                    id: '678',
                    parcelNumber: '910',
                    parcelType: 'basic',
                    longX: '62.5',
                    latY: '35.5',
                    geom: '14.67',
                    updatedAt: '2021-11-15T15:41:42+02:00'
                  }
                ]
              }
            ]
          }
        }
      }
    }
  ];

  it('runs queries', async () => {
    const wrapper = render(
      <MemoryRouter>
        <MockedProvider mock={mocks} addTypename={false}>
          <UserShow />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(wrapper.queryByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(wrapper.queryByText('loader')).not.toBeInTheDocument();
    }, 10);
  });
});
