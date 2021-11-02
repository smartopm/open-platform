import React from 'react';
import { render, waitFor } from '@testing-library/react';
import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import '@testing-library/jest-dom/extend-expect';
import InvitedGuests from '../../Components/InvitedGuests';
import { InvitedGuestsQuery } from '../../graphql/queries';
import { Context } from '../../../../../containers/Provider/AuthStateProvider'
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
        query: InvitedGuestsQuery,
        variables: {
          query: ''
        }
      },
      result: {
        data: {
          invitedGuestList: [
            {
              id: '2acd2ecc-7ff2-4e93-a0fe-329468b2e420',
              name: 'Test two',
              guest: {
                id: '1388d45c-5279-4e90-9815-8ab33c49d382',
                name: 'Test two',
                imageUrl: null,
                avatarUrl: null
              },
              occursOn: [],
              visitEndDate: null,
              visitationDate: '2021-11-03T09:30:00Z',
              endTime: null,
              startTime: null,
              endsAt: '2021-11-01T21:15:29Z',
              startsAt: '2021-11-01T09:15:29Z',
              revoked: false
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

    expect(queryByText('guest.invite_guest')).toBeInTheDocument();

    await waitFor(() => {
      expect(queryAllByText('Test two')[0]).toBeInTheDocument();
      expect(queryAllByText('Test two')[0]).toBeInTheDocument();
      expect(queryAllByText('access_actions.grant_access')[0]).toBeInTheDocument();
      expect(queryAllByText('guest_book.start_of_visit')[0]).toBeInTheDocument();
    }, 20);
  });
});
