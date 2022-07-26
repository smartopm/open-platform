import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import LogBookItem from '../Components/LogBookItem';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { AllEventLogsQuery } from '../../../graphql/queries';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('LogBook Component', () => {
  const props = {
    router: {
      push: jest.fn()
    },
    offset: 0,
    tabValue: 0,
    handleTabValue: jest.fn()
  };

  const eventLogMock = {
    request: {
      query: AllEventLogsQuery,
      variables: {
        limit: 20,
        name: "",
        offset: 0,
        refId: null,
        refType: null,
        subject: ['user_entry', 'visitor_entry', 'user_temp', 'observation_log']
      }
    },
    result: {
      data: {
        result: [
          {
            id: 'cde66254-0538-478b-b672-d883b2fa7867',
            createdAt: '2022-04-01T02:36:07-06:00',
            refId: 'ee0d442c-6ec0-429d-bb78-b69bdd843163',
            refType: 'Logs::EntryRequest',
            subject: 'observation_log',
            sentence: 'XD UW  added an observation log to an entry request',
            data: {
              note: 'Exited'
            },
            imageUrls: null,
            actingUser: {
              name: 'XD UW ',
              id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
            },
            entryRequest: {
              reason: 'client',
              id: 'ee0d442c-6ec0-429d-bb78-b69bdd843163',
              grantedState: 1,
              grantedAt: '2021-10-28T00:11:09-06:00',
              name: 'Test ',
              startsAt: '2021-10-28T00:10:49-06:00',
              endsAt: '2021-10-28T00:10:49-06:00',
              visitationDate: null,
              visitEndDate: null,
              guestId: null,
              grantor: {
                name: 'XD UW ',
                id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
              }
            },
            user: null
          }
        ]
      }
    }
  };

  it('renders data successfully', async () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[eventLogMock]} addTypename={false}>
          <MockedThemeProvider>
            <BrowserRouter>
              <MockedSnackbarProvider>
                <LogBookItem {...props} />
              </MockedSnackbarProvider>
            </BrowserRouter>
          </MockedThemeProvider>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(container.queryAllByTestId('card')[0]).toBeInTheDocument();
      expect(container.queryByTestId('name')).toBeInTheDocument();
      expect(container.queryByTestId('observation_note')).toBeInTheDocument();
      expect(container.queryByTestId('created-at')).toBeInTheDocument();
      expect(container.queryByText('search:search.load_more')).toBeInTheDocument();

      expect(container.getAllByText('logbook.add_observation')[0]).toBeInTheDocument();

      fireEvent.click(container.getAllByText('logbook.add_observation')[0]);
      expect(container.getByText('observations.add_your_observation')).toBeInTheDocument();
      fireEvent.change(container.getByTestId('entry-dialog-field'), {
        target: { value: 'This is an observation' }
      });
      expect(container.getByTestId('entry-dialog-field').value).toBe('This is an observation');
      fireEvent.click(container.getByTestId('save'));

      fireEvent.click(container.getByTestId('add_button'));
      expect(container.getByText('logbook.new_invite')).toBeInTheDocument();
    });
  });

  it('renders search box successfully', async () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={[eventLogMock]} addTypename={false}>
          <MockedThemeProvider>
            <BrowserRouter>
              <MockedSnackbarProvider>
                <LogBookItem {...props} />
              </MockedSnackbarProvider>
            </BrowserRouter>
          </MockedThemeProvider>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      const searchBtn = container.getByTestId('access_search');
      expect(searchBtn).toBeInTheDocument();
      fireEvent.click(searchBtn);
      expect(container.getByTestId('search')).toBeInTheDocument();
      expect(container.queryAllByText('logbook.add_observation')[0]).toBeInTheDocument();
      fireEvent.click(container.getByTestId('reload'));
    });
  });
});
