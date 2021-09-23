import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import EntryLogs, { IndexComponent } from '../Components/EntryLogs';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('EntryLogs Component', () => {
  it('renders loader when loading record', () => {
    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <EntryLogs match={{ params: { id: '123' } }} />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });

  it('renders loader when loading record', () => {
    const dataMock = {
      result: [{
        id: 'aa796e02-88b4-4d31-a988-047e5b2e8193',
        createdAt: '2021-07-04T19:03:30+02:00',
        refId: 'faff8c88-982c-4f87-ba69-c43c06f6576e',
        refType: 'Logs::EntryRequest',
        subject: 'observation_log',
        sentence: 'X User added an observation log to an entry request',
        data: {
          note: 'Exited',
          ref_name: 'Test Entry'
        },
        actingUser: {
          name: 'X User',
          id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
        },
        entryRequest: {
          reason: 'sales',
          id: 'faff8c88-982c-4f87-ba69-c43c06f6576e',
          grantedState: 1,
          grantedAt: '2021-07-02T11:19:27+02:00',
          name: 'HU',
          startsAt: '2021-07-02T11:19:27+02:00',
          visitationDate: '2021-07-02T11:19:27+02:00'
        }
      }]
    }
    const props = {
      data: dataMock,
      router: {
        push: jest.fn()
      },
      paginate: jest.fn(),
      offset: 0,
      limit: 20,
      searchTerm: '',
      handleSearch: jest.fn(),
      tabValue: 1,
      handleTabValue: jest.fn(),
      loading: false,
      refetch: jest.fn()
    };
    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <IndexComponent {...props} />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );

    expect(container.queryByTestId('visitor_name').textContent).toContain('Test Entry');
    expect(container.queryByTestId('access_status').textContent).toContain('logbook.granted_access');
    expect(container.queryByTestId('entry_time')).toBeInTheDocument();
    expect(container.queryByTestId('entry_date')).toBeInTheDocument();
    expect(container.queryByTestId('entry_reason').textContent).toContain('sales');
    expect(container.queryByTestId('acting_user').textContent).toContain('X User');
    expect(container.queryByText('common:misc.more_details')).toBeInTheDocument();
    expect(container.queryAllByText('logbook.add_observation')[0]).toBeInTheDocument();
    expect(container.queryByText('logbook.log_exit')).toBeInTheDocument();
    expect(container.queryByText('misc.previous')).toBeInTheDocument();
    expect(container.queryByText('misc.next')).toBeInTheDocument();
    expect(container.queryByLabelText('simple tabs example')).toBeInTheDocument()

    fireEvent.change(container.queryByLabelText('simple tabs example'))
  });
});
