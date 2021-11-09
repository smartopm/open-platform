import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { EntryRequestQuery } from '../../../graphql/queries';
import RequestUpdate from '../Components/RequestUpdate';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { EntryRequestUpdateMutation } from '../graphql/logbook_mutations';
import { EntryRequestContext } from '../GuestVerification/Context';
import authState from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('RequestUpdate Component', () => {
  const mocks = {
    request: {
      query: EntryRequestQuery,
      variables: { id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761' }
    },
    result: {
      data: {
        result: {
          id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761',
          name: 'A new name',
          phoneNumber: '309475834',
          email: 'email@gmail.com',
          nrc: '37348u53',
          vehiclePlate: null,
          reason: 'prospective_client',
          otherReason: null,
          concernFlag: null,
          grantedState: 1,
          createdAt: '2020-10-15T09:31:02Z',
          updatedAt: '2020-10-15T09:31:06Z',
          grantedAt: '2020-10-15T09:31:06Z',
          revokedAt: '2020-10-15T09:31:06Z',
          isGuest: true,
          grantor: {
            name: 'Some guard',
            __typename: 'User'
          },
          user: {
            id: 'a54d6184-b10e-4865-bee7-7957701d423d',
            name: 'John',
            __typename: 'User'
          },
          occursOn: ['monday'],
          visitEndDate: '2020-10-15T09:31:06Z',
          visitationDate: '2020-10-05T09:31:06Z',
          endsAt: '2020-10-15T09:31:06Z',
          startsAt: '2020-10-15T19:31:06Z',
          endTime: '2020-10-15T09:31:06Z',
          startTime: '2020-10-15T19:31:06Z',
          companyName: '',
          __typename: 'EntryRequest'
        }
      }
    }
  };
  it('should render RequestUpdate page without error', async () => {
    const previousRoute = 'nowhere';
    const isGuestRequest = false;
    const isScannedRequest = false;

    const container = render(
      <MockedProvider mocks={[mocks]} addTypename>
        <BrowserRouter>
          <MockedThemeProvider>
            <Context.Provider value={authState}>
              <EntryRequestContext.Provider
                value={{
                  request: { id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761' },
                  grantAccess: jest.fn()
                }}
              >
                <RequestUpdate
                  id="3c2f8ee2-598b-437c-b217-3e4c0f86c761"
                  previousRoute={previousRoute}
                  isGuestRequest={isGuestRequest}
                  isScannedRequest={isScannedRequest}
                  tabValue=""
                />
              </EntryRequestContext.Provider>
            </Context.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(
      () => {
        const entryName = container.queryByTestId('entry_user_name');
        fireEvent.change(entryName, { target: { value: 'Some User Nam' } });
        expect(entryName.value).toBe('Some User Nam');

        const entryEmail = container.queryByTestId('email');
        fireEvent.change(entryEmail, { target: { value: 'myemail@gmail.com' } });
        expect(entryEmail.value).toBe('myemail@gmail.com');

        fireEvent.change(container.queryByTestId('entry_user_nrc'), {
          target: { value: '100100/10/1' }
        });
        expect(container.queryByTestId('entry_user_nrc').value).toBe('100100/10/1');

        fireEvent.change(container.queryByTestId('entry_user_phone'), {
          target: { value: '100100' }
        });
        expect(container.queryByTestId('entry_user_phone').value).toBe('100100');

        fireEvent.change(container.queryByTestId('entry_user_vehicle'), {
          target: { value: 'ABT' }
        });
        expect(container.queryByTestId('entry_user_vehicle').value).toBe('ABT');
        expect(container.queryByTestId('entry_user_grant').textContent).toContain(
          'logbook:logbook.grant'
        );
        expect(container.queryByTestId('entry_user_grant')).not.toBeDisabled();
        expect(container.queryByTestId('entry_user_deny').textContent).toContain(
          'logbook:logbook.deny'
        );
        expect(container.queryByTestId('entry_user_next').textContent).toContain(
          'logbook:logbook.next_step'
        );
        expect(container.queryByTestId('entry_user_deny')).not.toBeDisabled();
        expect(container.queryByTestId('entry_user_call_mgr').textContent).toContain(
          'logbook:logbook.call_manager'
        );
        expect(container.queryByText('form_fields.full_name')).toBeInTheDocument();

        fireEvent.click(container.queryByTestId('entry_user_grant'));
      },
      { timeout: 50 }
    );
  });

  it('should render proper form when coming from guest list', async () => {
    const previousRoute = 'guests';
    const isGuestRequest = true;
    const isScannedRequest = false;
    const updateMock = {
      request: {
        query: EntryRequestUpdateMutation,
        variables: {
          id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761',
          name: 'some name',
          phoneNumber: '',
          nrc: '',
          vehiclePlate: '',
          reason: '',
          business: '',
          state: '',
          userType: '',
          expiresAt: '',
          email: '',
          companyName: '',
          temperature: '',
          loaded: false,
          occursOn: [],
          visitEndDate: '',
          visitationDate: '',
          endsAt: '',
          startsAt: ''
        },
        result: {
          data: {
            entryRequestUpdate: {
              id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761'
            }
          }
        }
      }
    };
    const container = render(
      <MockedProvider mocks={[mocks, updateMock]} addTypename>
        <BrowserRouter>
          <MockedThemeProvider>
            <Context.Provider value={authState}>
              <EntryRequestContext.Provider
                value={{
                  request: {
                    id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761',
                    user: { id: 'a54d6184-b10e-4865-bee7-7957701d423d' }
                  },
                  grantAccess: jest.fn()
                }}
              >
                <RequestUpdate
                  id="3c2f8ee2-598b-437c-b217-3e4c0f86c761"
                  previousRoute={previousRoute}
                  isGuestRequest={isGuestRequest}
                  isScannedRequest={isScannedRequest}
                  tabValue="2"
                />
              </EntryRequestContext.Provider>
            </Context.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByText('form_fields.full_name')).toBeInTheDocument();
      expect(container.queryByTestId('entry_user_call_mgr')).toBeInTheDocument();
      expect(container.queryByTestId('entry_user_grant')).toBeInTheDocument();
      expect(container.queryByTestId('guest_repeats_on')).toBeInTheDocument();
      expect(container.queryByTestId('guest_repeats_on').textContent).toContain(
        'guest_book.repeats_on'
      );
    }, 50);
  });

  it('should render proper form when enrolling a user for the first time', async () => {
    const previousRoute = 'enroll';
    const isGuestRequest = false;
    const isScannedRequest = false;
    const permissions = ['can_create_user'];
    const user = {
      ...authState,
      user: {
        ...authState.user,
        // modify current permission
        permissions: { ...authState.user.permissions, user: { permissions } }
      }
    };
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename>
        <BrowserRouter>
          <MockedThemeProvider>
            <Context.Provider value={user}>
              <EntryRequestContext.Provider
                value={{
                  request: { id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761' },
                  grantAccess: jest.fn()
                }}
              >
                <RequestUpdate
                  id="3c2f8ee2-598b-437c-b217-3e4c0f86c761"
                  previousRoute={previousRoute}
                  isGuestRequest={isGuestRequest}
                  isScannedRequest={isScannedRequest}
                  tabValue=""
                />
              </EntryRequestContext.Provider>
            </Context.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByText('form_fields.full_name')).toBeInTheDocument();
      expect(container.queryByTestId('entry_user_call_mgr')).not.toBeInTheDocument();
      expect(container.queryByTestId('entry_user_enroll')).toBeInTheDocument();
      expect(container.queryByTestId('entry_user_enroll').textContent).toContain(
        'logbook:logbook.enroll'
      );
    }, 50);
  });
});
