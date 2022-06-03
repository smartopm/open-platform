import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import GuestsView from '../Components/GuestsView';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock';

describe('Should render Guests View Component', () => {
  const mockHistory = {
    push: jest.fn(),
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });

  const mocks = {
    request: {
      query: GuestEntriesQuery,
      variables: { offset: 0, limit: 50, query: '' }
    },
    result: {
      data: {
        scheduledRequests: [
          {
            id: 'a91dbad4-eeb4',
            name: 'Test another',
            user: {
              id: '162f7517',
              name: 'Js user x',
              status: 'active'
            },
            guest: {
              id: '162f7517',
              name: 'Js user a',
              status: 'active'
            },
            closestEntryTime: {
              visitEndDate: null,
              visitationDate: '2021-08-20T10:51:00+02:00',
              endsAt: '2021-10-31 22:51',
              startsAt: '2021-10-31 02:51',
              occursOn: []
            },
            status: 'approved',
            occursOn: [],
            visitEndDate: null,
            visitationDate: '2021-08-20T10:51:00+02:00',
            endTime: '2021-10-31 22:51',
            startTime: '2021-10-31 02:51',
            endsAt: '2021-10-31 22:51',
            startsAt: '2021-10-31 02:51',
            exitedAt: '2021-10-31 22:51',
            revoked: true,
            thumbnailUrl: 'https://some-video.com',
            multipleInvites: true
          },
          {
            id: '696d857',
            name: 'X Name',
            user: {
              id: '162f7517-69',
              name: 'Js sdd'
            },
            guest: {
              id: '162f7517',
              name: 'Js user x',
              status: 'active'
            },
            closestEntryTime: {
              visitEndDate: null,
              visitationDate: '2021-08-20T10:51:00+02:00',
              endsAt: '2021-10-31 22:51',
              startsAt: '2021-10-31 02:51',
              occursOn: []
            },
            status: 'approved',
            occursOn: [],
            visitEndDate: null,
            visitationDate: '2021-08-31T10:20:21+02:00',
            endTime: '2021-10-31 22:51',
            startTime: '2021-10-31 02:51',
            endsAt: '2021-10-31 22:51',
            startsAt: '2021-10-31 02:51',
            exitedAt: '2021-10-31 22:51',
            revoked: false,
            thumbnailUrl: null,
            multipleInvites: false
          }
        ]
      }
    }
  };

  const errorMock = {
    request: {
      query: GuestEntriesQuery,
      variables: { offset: 0, limit: 50, query: '' }
    },
    result: {
      data: {
        scheduledRequests: null
      }
    },
    error: new Error('Something wrong happened')
  };

  it('should render proper data', async () => {
    const { getAllByText, getAllByTestId, getByText } = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[mocks]} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <GuestsView
                tabValue={1}
                handleAddObservation={jest.fn()}
                offset={0}
                limit={50}
                query=""
                timeZone="Africa/Maputo"
                speedDialOpen={false}
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
      expect(getByText('X Name')).toBeInTheDocument();
      expect(getByText('Js sdd')).toBeInTheDocument();
      expect(getAllByTestId('multiple_host')[0]).toBeInTheDocument();
      expect(getAllByTestId('user_name')[0]).toBeInTheDocument();
      // expect(getByText('Js user x')).toBeInTheDocument();
      expect(getAllByTestId('request_status')[0]).toBeInTheDocument();
      expect(getAllByTestId('request_status')[0].textContent).toContain('guest_book.approved');
      expect(getAllByTestId('request_preview')[0].textContent).toContain('X');
      expect(getAllByTestId('video_preview')[0]).toBeInTheDocument();
      expect(getAllByText('guest_book.start_of_visit')[0]).toBeInTheDocument();
      expect(getAllByTestId('grant_access_btn')[0]).toBeInTheDocument();
      expect(getAllByTestId('grant_access_btn')[0].textContent).toContain(
        'access_actions.grant_access'
      );
      expect(getAllByTestId('grant_access_btn')[0]).toBeDisabled();
      expect(getAllByTestId('user_name')[0]).toBeInTheDocument();
      expect(getAllByText('misc.previous')[0]).toBeInTheDocument();
      expect(getAllByText('misc.next')[0]).toBeInTheDocument();

      fireEvent.click(getAllByTestId('card')[0]);
      expect(mockHistory.push).toBeCalled();

      fireEvent.click(getAllByTestId('user_name')[0]);
      expect(mockHistory.push).toBeCalled();
      expect(mockHistory.push).toBeCalledWith('/user/162f7517-69?tab=null'); // check if it routes to the user page
    }, 10);
  });

  it('should render error if something went wrong', async () => {
    const { getByText } = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <GuestsView
                tabValue={1}
                handleAddObservation={jest.fn()}
                offset={0}
                limit={50}
                query=""
                timeZone="Africa/Maputo"
                speedDialOpen={false}
              />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(getByText('Something wrong happened')).toBeInTheDocument();
      expect(getByText('logbook.no_invited_guests')).toBeInTheDocument();
    }, 10);
  });
});
