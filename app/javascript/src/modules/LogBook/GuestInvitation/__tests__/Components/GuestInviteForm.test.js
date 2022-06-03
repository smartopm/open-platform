import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import GuestInviteForm from '../../Components/GuestInviteForm';

import InvitationCreateMutation from '../../graphql/mutations';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/authstate';
import { SearchGuestsQuery } from '../../graphql/queries';

describe('Guest Invitation Form', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  const guest = {
    visitationDate: null,
    startsAt: null,
    endsAt: null,
    occursOn: [],
    visitEndDate: null
  };

  const createInviteMock = {
    request: {
      query: InvitationCreateMutation,
      variables: {
        visitationDate: guest.visitationDate,
        startsAt: guest.startsAt,
        endsAt: guest.endsAt,
        occursOn: guest.occursOn,
        visitEndDate: guest.visitEndDate,
        guests: [],
        userIds: []
      }
    },
    result: {
      data: {
        invitationCreate: {
          success: true
        }
      }
    }
  };

  const searchGuestsMock = {
    request: {
      query: SearchGuestsQuery,
      variables: { query: '' }
    },
    result: {
      data: {
        searchGuests: [
          {
            id: 'some id',
            name: 'some user',
            imageUrl: null,
            avatarUrl: null
          }
        ]
      }
    }
  };

  it('should render the invitation form', async () => {
    const { getByTestId, getAllByText } = render(
      <MemoryRouter>
        <Context.Provider value={userMock}>
          <MockedProvider mocks={[createInviteMock, searchGuestsMock]} addTypename={false}>
            <GuestInviteForm />
          </MockedProvider>
        </Context.Provider>
      </MemoryRouter>
    );

    expect(getByTestId('invite_button')).toBeInTheDocument();

    expect(getAllByText('common:misc.day_of_visit')[0]).toBeInTheDocument();
    expect(getAllByText('common:misc.start_time')[0]).toBeInTheDocument();
    expect(getAllByText('common:misc.end_time')[0]).toBeInTheDocument();

    fireEvent.change(getByTestId('search'), { target: { value: '090909090' } })

    fireEvent.click(getByTestId('invite_button'));
    await waitFor(() => {
      expect(getAllByText('guest.guest_invited')[0]).toBeInTheDocument();
      expect(mockHistory.push).toBeCalled();
      expect(mockHistory.push).toBeCalledWith('/logbook/guests');
    }, 50);
  });

  it('should render the same form for guest update', async () => {
    const props = {
      onUpdate: () => {},
      close: () => {},
      update: true,
      inviteDetails: {
        id: 'ei1298-sijf2382-poiouw9-8823ybsa',
        status: 'active',
        startsAt: '2022-06-02T12:00:00Z',
        endsAt: '2022-06-12T1:00:00Z',
        occursOn: ['sunday', 'monday'],
        visitationDate: '2022-06-02',
        visitEndDate: '2022-06-12',
        loading: false,
        name: 'John Doe'
      }
    };
    const screen = render(
      <MemoryRouter>
        <Context.Provider value={userMock}>
          <MockedProvider mocks={[createInviteMock, searchGuestsMock]} addTypename={false}>
            <GuestInviteForm {...props} />
          </MockedProvider>
        </Context.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('guest.name_print')).toBeInTheDocument();
    expect(screen.getAllByText('common:misc.day_of_visit').length).toBeGreaterThan(1);
    expect(screen.getByDisplayValue('12:00 PM')).toBeInTheDocument();
    expect(screen.getAllByTestId('date-picker')[0]).toBeInTheDocument();
    expect(screen.getByTestId('close_button')).toBeInTheDocument();
    expect(screen.getByTestId('update_button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('update_button'));
    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });
});
