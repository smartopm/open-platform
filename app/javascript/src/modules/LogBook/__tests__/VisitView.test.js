/* eslint-disable max-statements */
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import VisitView from '../Components/VisitView';
import { CurrentGuestEntriesQuery } from '../graphql/guestbook_queries';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';

describe('Should render Visits View Component', () => {
  const mockHistory = {
    push: jest.fn()
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  const mocks = {
    request: {
      query: CurrentGuestEntriesQuery,
      variables: { offset: 0, limit: 50, query: '' }
    },
    result: {
      data: {
        currentGuests: [
          {
            id: 'a91dbad4-eeb4',
            name: 'Test another',
            user: {
              id: '162f7517',
              name: 'Js user x'
            },
            guest: {
              id: '162f7517',
              name: 'Js user x',
            },
            entryTimes: [
              {
                visitEndDate: null,
                visitationDate: '2021-08-20T10:51:00+02:00',
                endsAt: '2021-10-31 22:51',
                startsAt: '2021-10-31 02:51',
                occursOn: []
              }
            ],
            grantedAt: '2021-10-31 02:51',
            status: 'pending',
            exitedAt: null,
            guestId: "92839182",
            grantedState: 1
          },
          {
            id: 'a91dbad4-293849dasda',
            name: 'User',
            user: {
              id: '23easd',
              name: 'user x'
            },
            guest: {
              id: '162f7517',
              name: 'Js user x',
              imageUrl: 'https://lh3.googleusercontent.com'
            },
            accessHours: null,
            grantedAt: '2021-10-31 02:51',
            status: 'approved',
            exitedAt: '2021-10-31 03:51',
            guestId: "162f7517",
            grantedState: 3
          },
          {
            id: '92384932edas-293849dasda',
            name: 'Some User',
            user: {
              id: 'some some',
              name: 'user x'
            },
            guest: null,
            accessHours: null,
            grantedAt: '2021-10-31 02:51',
            status: 'pending',
            exitedAt: null,
            guestId: null,
            grantedState: 1
          },
        ]
      }
    }
  };

  const errorMock = {
    request: {
      query: CurrentGuestEntriesQuery,
      variables: { offset: 0, limit: 50, query: '' }
    },
    result: {
      data: {
        currentGuests: null
      }
    },
    error: new Error('Something wrong happened')
  };

  const props = {
    handleAddObservation: jest.fn(),
    observationDetails: {
      loading: false,
      refetch: false
    }
  };
  it('should render proper data', async () => {
    const { getAllByTestId, getByText } = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[mocks]} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <VisitView
                tabValue={2}
                offset={0}
                limit={50}
                query=""
                timeZone="Africa/Maputo"
                {...props}
              />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    // initially it should not contain any guests, this is because we lazily load this query
    expect(getByText('logbook.no_invited_guests')).toBeInTheDocument();

    await waitFor(() => {
      expect(getByText('Test another')).toBeInTheDocument();
      expect(getByText('Js user x')).toBeInTheDocument();
      expect(getByText('logbook:logbook.host:')).toBeInTheDocument();
      expect(getAllByTestId('entered_at')[0]).toBeInTheDocument();
      expect(getAllByTestId('request_avatar')[0].textContent).toContain('T');
      expect(getAllByTestId('request_avatar')[1].textContent).toContain('U');
      expect(getAllByTestId('request_avatar')[2].textContent).toContain('S');
      expect(getAllByTestId('exited_at')[0]).toBeInTheDocument();
      expect(getAllByTestId('exited_at')[0].textContent).toContain('logbook.log_exit');
      expect(getAllByTestId('exited_at')[1].textContent).toContain('guest_book.exited_at');
      expect(getAllByTestId('log_exit')[0]).toBeInTheDocument();
      expect(getAllByTestId('guest_validity')[0]).toBeInTheDocument();
      expect(getAllByTestId('entry_state')[0].textContent).toContain('guest_book.invalid_now');
      expect(getAllByTestId('entry_state')[1].textContent).toContain('guest_book.scanned_entry');
      expect(getAllByTestId('entry_state')[2].textContent).toContain('guest_book.manual_entry');
      expect(getAllByTestId('host_title')[0].textContent).toContain('logbook:logbook.host');
      expect(getAllByTestId('host_title')[1].textContent).toContain('logbook:log_title.guard:  ');
      expect(getAllByTestId('host_title')[2].textContent).toContain('logbook:log_title.guard:  ');
      expect(getAllByTestId('request_status')[0]).toBeInTheDocument();
      expect(getAllByTestId('request_status')[0].textContent).toContain('guest_book.pending');
      expect(getAllByTestId('request_status')[1].textContent).toContain('guest_book.approved');
      expect(getAllByTestId('log_exit')[0]).not.toBeDisabled();

      fireEvent.click(getAllByTestId('log_exit')[0]);
      expect(props.handleAddObservation).toBeCalled();

      fireEvent.click(getAllByTestId('card')[0]);
      expect(mockHistory.push).toBeCalled();

      fireEvent.click(getAllByTestId('user_name')[0]);
      expect(mockHistory.push).toBeCalled();
      expect(mockHistory.push).toBeCalledWith('/user/162f7517'); // check if it routes to the user page
    }, 10);
  });

  it('should render error if something went wrong', async () => {
    const { getByText } = render(
      <Context.Provider value={authState}>
        <MemoryRouter>
          <MockedProvider mocks={[errorMock]} addTypename={false}>
            <MockedThemeProvider>
              <VisitView
                tabValue={2}
                offset={0}
                limit={50}
                query=""
                timeZone="Africa/Maputo"
                {...props}
              />
            </MockedThemeProvider>
          </MockedProvider>
        </MemoryRouter>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(getByText('Something wrong happened')).toBeInTheDocument();
      expect(getByText('logbook.no_invited_guests')).toBeInTheDocument();
    }, 10);
  });
});
