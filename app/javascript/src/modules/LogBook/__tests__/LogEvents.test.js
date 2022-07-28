import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import LogEvents from '../Components/LogEvents';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Log Events Component', () => {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 1);

  const log = {
    result: [
      {
        id: 'cde66254-0538-478b-b672-d883b2fa7867',
        createdAt: '2022-04-01T02:36:07-06:00',
        refId: 'ee0d442c-6ec0-429d-bb78-b69bdd843163',
        refType: 'Logs::EntryRequest',
        subject: 'visit_entry',
        sentence: 'XD UW  added an observation log to an entry request',
        data: {
          note: '23'
        },
        imageUrls: 'http:image.com',
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
  };

  const actions = jest.fn();
  const logExit = jest.fn();

  it('renders log event component', () => {
    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={authState}>
              <LogEvents
                eventsData={log}
                userType="admin"
                handleExitEvent={logExit}
                handleAddObservation={jest.fn()}
                routeToAction={actions}
              />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(container.queryAllByTestId('card')[0]).toBeInTheDocument();
    expect(container.queryByTestId('name')).toBeInTheDocument();
    expect(container.queryByTestId('created-at')).toBeInTheDocument();
    expect(container.queryByTestId('image-area')).toBeInTheDocument();
    expect(container.queryAllByTestId('menu-list')[0]).toBeInTheDocument();
    expect(container.queryByTestId('acting_guard_title')).toBeInTheDocument();
    expect(container.queryByTestId('acting_user_name')).toBeInTheDocument();
    expect(container.queryByTestId('observation_note')).toBeInTheDocument();

    fireEvent.click(container.queryAllByTestId('menu-list')[0]);
    expect(container.queryAllByText('logbook.view_details')[0]).toBeInTheDocument();
    expect(container.queryAllByText('logbook.exit_log')[0]).toBeInTheDocument();

    fireEvent.click(container.queryAllByText('logbook.view_details')[0]);
    expect(actions).toBeCalled();

    fireEvent.click(container.queryAllByText('logbook.exit_log')[0]);
    expect(logExit).toBeCalled();
  });

  it('renders no logs when data is empty', () => {
    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={authState}>
              <LogEvents
                eventsData={{ data: { result: [] } }}
                userType="admin"
                handleExitEvent={jest.fn()}
                handleAddObservation={jest.fn()}
                routeToAction={jest.fn()}
              />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(container.queryByText('logbook.no_logs')).toBeInTheDocument();
  });
});
