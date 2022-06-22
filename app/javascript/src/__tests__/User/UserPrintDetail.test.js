import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import IdPrintPage, { qrCodeAddress, UserPrintDetail } from '../../containers/IdPrint';
import { Context } from '../../containers/Provider/AuthStateProvider';
import { UserQuery } from '../../graphql/queries';
import authState from '../../__mocks__/authstate';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('UserPrint Detail component', () => {
  const data = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'client',
      expiresAt: null
    }
  };
  it('should render correctly', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <UserPrintDetail data={data} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(container.queryByText('Another somebodyy')).toBeInTheDocument();
      expect(container.getByTestId('download_button')).toBeInTheDocument();
      expect(container.getByTestId('error')).toBeInTheDocument();
      expect(container.getByTestId('error').textContent).toBe('');
      expect(container.queryByTestId('download_button').textContent).toContain('misc.download_id');
    }, 10);
  });
  it('renders id card page', async () => {
    const matchProps = {
      params: { id: '59927651-9bb4-4e47-8afe-0989d03d210d' }
    };
    const mock = {
      request: {
        query: UserQuery,
        variables: { id: matchProps.params.id }
      },
      result: {
        data: {
          user: {
            id: matchProps.params.id,
            name: 'some user',
            __typename: 'User',
            contactInfos: null,
            substatusLogs: null,
            formUsers: null,
            labels: null,
            notes: [],
            imageUrl: null,
            avatarUrl: null,
            accounts: null,
            extRefId: null,
            address: null,
            subStatus: null,
            email: null,
            expiresAt: null,
            state: null,
            requestReason: null,
            vehicle: null,
            roleName: null,
            phoneNumber: null,
            lastActivityAt: null,
            userType: 'client',
            status: 'active'
          }
        }
      }
    };
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[mock]} addTypename>
          <BrowserRouter>
            <MockedThemeProvider>
              <IdPrintPage match={matchProps} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(container.getByTestId('error').textContent).toBe('');
      expect(container.queryByText('some user')).toBeInTheDocument();
    }, 10);
  });
  it('renders an error when not fetched properly', async () => {
    const matchProps = {
      params: { id: '59927651-9bb4-4e47-8afe-0989d03d210d' }
    };
    const mock = {
      request: {
        query: UserQuery,
        variables: { id: matchProps.params.id }
      },
      result: {
        data: {
          user: null
        }
      },
      error: new Error('Something wrong happened')
    };
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[mock]} addTypename>
          <BrowserRouter>
            <MockedThemeProvider>
              <IdPrintPage match={matchProps} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText('Network error: Something wrong happened')).toBeInTheDocument();
      expect(container.queryByText('some user')).not.toBeInTheDocument();
    }, 10);
  });

  it('test for the qr code helper', () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-01-01 01:00'));
    const link = qrCodeAddress('somefsuhdw83928329');
    expect(link).toContain('http://localhost/user/somefsuhdw83928329/1609462800000');
  });
});
