import React from 'react';
import { render, waitFor } from '@testing-library/react';
import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import '@testing-library/jest-dom/extend-expect';
import InvitedGuests from '../../Components/InvitedGuests';
import { MyInvitedGuestsQuery } from '../../graphql/queries';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/userMock';

describe('Invited Guests Component', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  it('should render the invited guests', async () => {
    const invitedGuests = {
      request: {
        query: MyInvitedGuestsQuery,
        variables: {
          query: ''
        }
      },
      result: {
        data: {
          myGuests: [
            {
              id: '4af00f39-7fcd-47d2-89bf-e93827d34666',
              guest: {
                id: '1388d45c-5279-4e90-9815-8ab33c49d382',
                name: 'Test two',
                imageUrl: null,
                avatarUrl: null,
                request: {
                  id: '2acd2ecc-7ff2-4e93-a0fe-329468b2e420',
                  status: 'pending',
                  revoked: false
                }
              },
              entryTime: {
                id: '1841e4dc-0e7c-4297-be0b-3c00db12a668',
                occursOn: [],
                visitEndDate: null,
                visitationDate: '2021-11-30T11:54:00Z',
                endsAt: '2021-11-01T21:15:29Z',
                startsAt: '2021-11-01T09:15:29Z'
              }
            }
          ]
        }
      }
    };
    const { getByTestId, queryByText, queryAllByText } = render(
      <Context.Provider value={userMock}>
        <MemoryRouter>
          <MockedProvider mocks={[invitedGuests]} addTypename={false}>
            <MockedThemeProvider>
              <InvitedGuests />
            </MockedThemeProvider>
          </MockedProvider>
        </MemoryRouter>
      </Context.Provider>
    );

    const search = getByTestId('search');

    expect(search).toBeInTheDocument();

    expect(queryByText('common:menu.guest_list')).toBeInTheDocument();
    expect(getByTestId('speed_dial_add_guest')).toBeInTheDocument();

    await waitFor(() => {
      expect(queryAllByText('Test two')[0]).toBeInTheDocument();
      expect(queryAllByText('Test two')[0]).toBeInTheDocument();
      expect(getByTestId('validity')).toBeInTheDocument();
      expect(getByTestId('status')).toBeInTheDocument();
      expect(getByTestId('speed_dial_add_guest')).toBeInTheDocument();
      expect(queryAllByText('guest_book.start_of_visit')[0]).toBeInTheDocument();
    }, 20);
  });
});