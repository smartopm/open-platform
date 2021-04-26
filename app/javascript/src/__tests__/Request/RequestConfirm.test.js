import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import RequestConfirm from '../../containers/Requests/RequestConfirm';
import { EntryRequestQuery } from '../../graphql/queries';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('RequestConfirm main page', () => {
  const params = {
    params: {
      id: 340
    }
  };

  const history = {
    push: jest.fn
  };

  const mocks = [
    {
      request: {
        query: EntryRequestQuery,
        variables: { id: '340' }
      },
      result: {
        data: {
          result: {
            id: '340',
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
        }
      }
    }
  ];

  it('renders the RequestConfirm page correctly', async () => {
    await act(async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <RequestConfirm match={params} history={history} />
        </MockedProvider>
      );
    });
  });
});
