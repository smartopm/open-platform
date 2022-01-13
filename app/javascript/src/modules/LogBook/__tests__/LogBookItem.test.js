import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import LogBookItem from '../Components/LogBookItem';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('LogBook Component', () => {
  // const endTime = new Date();
  // endTime.setHours(endTime.getHours() + 1);

  const props = {
    router: {
      push: jest.fn()
    },
    paginate: jest.fn(),
    offset: 0,
    limit: 20,
    searchTerm: '',
    searchQuery: '',
    handleSearch: jest.fn(),
    queryOnChange: jest.fn(),
    tabValue: 0,
    handleTabValue: jest.fn(),
    loading: false,
    refetch: jest.fn(),
    toggleFilterMenu: jest.fn(),
    handleSearchClear: jest.fn(),
    displayBuilder: "none"
  };

  it('renders data successfully', async () => {
    const dataMock = [{
        id: 'aa796e02-88b4-4d31-a988-047e5b2e8193',
        createdAt: '2021-07-04T19:03:30+02:00',
        refId: 'faff8c88-982c-4f87-ba69-c43c06f6576e',
        refType: 'Logs::EntryRequest',
        subject: 'visitor_entry',
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
          visitationDate: '2021-07-02T11:19:27+02:00',
          grantor: {
            name: 'John Doe'
          }
        }
      }]

    props.data = dataMock;

    const container = render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <LogBookItem {...props} scope={2} />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryAllByTestId('card')[0]).toBeInTheDocument();
      expect(container.queryByTestId('name')).toBeInTheDocument();
      expect(container.queryByTestId('acting_guard_title')).toBeInTheDocument();
      expect(container.queryByTestId('observation_note')).toBeInTheDocument();
      expect(container.queryByTestId('created-at')).toBeInTheDocument();
      expect(container.queryAllByText('misc.previous')[0]).toBeInTheDocument();
      expect(container.queryAllByText('misc.next')[0]).toBeInTheDocument();
      expect(container.queryByLabelText('simple tabs example')).toBeInTheDocument()

      fireEvent.change(container.queryByLabelText('simple tabs example'))

      fireEvent.click(container.queryAllByTestId('next-btn')[0])
    })
  });

  it('renders active visit logs', async () => {
    const dataMock = [
        {
          "id": "02b656be-00b3-4bc2-90a4-0d86d2b72d2a",
          "createdAt": "2021-09-22T13:57:55+02:00",
          "refId": "eedf3caf-13a1-4d5b-ac9a-22dd99a64bb2",
          "refType": "Logs::EntryRequest",
          "subject": "visitor_entry",
          "sentence": "Admin User granted Test Guest for entry.",
          "data": {
              "action": "granted",
              "ref_name": "Test Guest",
              "type": "admin"
          },
          "actingUser": {
              "name": "Admin User",
              "id": "bdf23d62-071c-4fdf-8ee5-7add18236090"
          },
          "entryRequest": {
              "reason": "client",
              "id": "eedf3caf-13a1-4d5b-ac9a-22dd99a64bb2",
              "grantedState": 1,
              "grantedAt": "2021-09-22T13:57:55+02:00",
              "name": "Test Guest",
              "startsAt": "2021-09-23T09:49:14+02:00",
              "visitationDate": "2021-09-23T09:50:00+02:00"
          },
          "user": null
        }
      ]

    props.data = dataMock;

    render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <LogBookItem {...props} scope={2} />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.queryByTestId('name').textContent).toContain('Test Guest');
    })
  });

  it('renders active visit logs by visitEndDate', async () => {
    const visitEndDate = new Date();
    visitEndDate.setDate(visitEndDate.getDate() + 5)

    const dataMock = [
      {
        id: '02b656be-00b3-4bc2-90a4-0d86d2b72d2a',
        createdAt: '2021-09-22T13:57:55+02:00',
        refId: 'eedf3caf-13a1-4d5b-ac9a-22dd99a64bb2',
        refType: 'Logs::EntryRequest',
        subject: 'visitor_entry',
        sentence: 'Admin User granted Test Guest for entry.',
        data: {
          action: 'granted',
          ref_name: 'Test Guest',
          type: 'admin'
        },
        actingUser: {
          name: 'Admin User',
          id: 'bdf23d62-071c-4fdf-8ee5-7add18236090'
        },
        entryRequest: {
          reason: 'client',
          id: 'eedf3caf-13a1-4d5b-ac9a-22dd99a64bb2',
          grantedState: 1,
          grantedAt: '2021-09-22T13:57:55+02:00',
          name: 'Test Guest',
          startsAt: '2021-09-23T09:49:14+02:00',
          visitationDate: '2021-09-23T09:50:00+02:00',
          visitEndDate
        },
        user: null
      }
    ];

    props.data = dataMock;

    render(
      <MockedProvider>
        <MockedThemeProvider>
          <BrowserRouter>
            <Context.Provider value={userMock}>
              <LogBookItem {...props} scope={2} />
            </Context.Provider>
          </BrowserRouter>
        </MockedThemeProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.queryByTestId('name').textContent).toContain('Test Guest');
    })
  });
});
