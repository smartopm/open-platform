import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import GuestInviteForm from '../../Components/GuestInviteForm';

import InvitationCreateMutation from '../../graphql/mutations';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../../__mocks__/authstate';
import { SearchGuestsQuery } from '../../graphql/queries';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import { SnackbarContext } from '../../../../../shared/snackbar/Context';
import MockedSnackbarProvider, { mockedSnackbarProviderProps } from '../../../../__mocks__/mock_snackbar';

describe('Guest Invitation Form', () => {
  const mockHistory = {
    push: jest.fn()
  };
  const dateTime = new Date()
  beforeAll(() => {
    // Lock Time
    jest.useFakeTimers()
    jest.setSystemTime(dateTime);
  });

  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  const guest = {
    visitationDate: dateTime,
    startsAt: dateTime,
    endsAt: dateTime,
    occursOn: [],
    visitEndDate: dateTime
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

  // Todo: This needs to be fixed

  it('should render the invitation form', async () => {
    const { getByTestId, getAllByText } = render(
      <MemoryRouter>
        <Context.Provider value={userMock}>
          <MockedProvider mocks={[createInviteMock, searchGuestsMock]} addTypename={false}>
            <MockedThemeProvider>
              <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
                <GuestInviteForm />
              </SnackbarContext.Provider>
            </MockedThemeProvider>
          </MockedProvider>
        </Context.Provider>
      </MemoryRouter>
    );

    expect(getByTestId('invite_button')).toBeInTheDocument();

    expect(getAllByText('common:misc.day_of_visit')[0]).toBeInTheDocument();
    expect(getAllByText('common:misc.start_time')[0]).toBeInTheDocument();
    expect(getAllByText('common:misc.end_time')[0]).toBeInTheDocument();

    fireEvent.change(getByTestId('search'), { target: { value: '090909090' } });

    fireEvent.click(getByTestId('invite_button'));
    // await waitFor(() => {
    //   expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
    //     type: mockedSnackbarProviderProps.messageType.success,
    //     message: 'guest.guest_invited'
    //   });
    //   expect(mockHistory.push).toBeCalled();
    //   expect(mockHistory.push).toBeCalledWith('/logbook/guests');
    // }, 50);
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
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <GuestInviteForm {...props} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </MockedProvider>
        </Context.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('guest.name_print')).toBeInTheDocument();
    expect(screen.getAllByText('common:misc.day_of_visit').length).toBeGreaterThan(1);
    expect(screen.getAllByTestId('date-picker')[0]).toBeInTheDocument();
    expect(screen.getByTestId('close_button')).toBeInTheDocument();
    expect(screen.getByTestId('update_button')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('update_button'));
    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });
});
