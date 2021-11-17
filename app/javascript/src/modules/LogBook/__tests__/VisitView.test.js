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
              imageUrl: 'https://lh3.googleusercontent.com'
            },
            accessHours: [
              {
                visitEndDate: null,
                visitationDate: '2021-08-20T10:51:00+02:00',
                endsAt: '2021-10-31 22:51',
                startsAt: '2021-10-31 02:51',
                occursOn: []
              }
            ],
            grantedAt: '2021-10-31 02:51',
            exitedAt: null
          }
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
    const { getByTestId, getByText } = render(
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
      expect(getByText('logbook:logbook.host')).toBeInTheDocument();
      expect(getByTestId('entered_at')).toBeInTheDocument();
      expect(getByTestId('exited_at')).toBeInTheDocument();
      expect(getByTestId('log_exit')).toBeInTheDocument();
      expect(getByTestId('log_exit')).not.toBeDisabled();

      fireEvent.click(getByTestId('log_exit'));
      expect(props.handleAddObservation).toBeCalled();

      fireEvent.click(getByTestId('card'));
      expect(mockHistory.push).toBeCalled();
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
