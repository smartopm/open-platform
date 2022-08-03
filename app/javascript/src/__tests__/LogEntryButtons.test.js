import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import routeData, { MemoryRouter } from 'react-router';
import UserShow from '../modules/Users/Containers/UserShow';

import { UserAccountQuery, UserQuery } from '../graphql/queries';
import { Context } from '../containers/Provider/AuthStateProvider';
import authState from '../__mocks__/authstate';
import MockedThemeProvider from '../modules/__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Should check if the buttons are functional on userinformation', () => {
  const mockParams = {
    id: '1239283923e23'
  };
  beforeEach(() => {
    jest.spyOn(routeData, 'useParams').mockReturnValue(mockParams);
  });

  const mocks = {
    request: {
      query: UserQuery,
      variables: { id: mockParams.id }
    },
    result: {
      data: {
        user: {
          name: 'x JM J',
          userType: 'admin',
          lastActivityAt: null,
          phoneNumber: '260971500909090',
          roleName: 'Admin',
          vehicle: null,
          requestReason: null,
          id: '800b458a-e527-4410-9ca3-8c0c701045c5',
          state: 'valid',
          expiresAt: null,
          email: 'x@doublegdp.com',
          subStatus: null,
          status: 'active',
          address: 'some place in the world',
          extRefId: null,
          accounts: null,
          avatarUrl: null,
          imageUrl: null,
          notes: [],
          labels: null,
          contactInfos: null,
          formUsers: null,
          substatusLogs: null,
          __typename: 'User'
        }
      }
    }
  };
  const accountMock = {
    request: {
      query: UserAccountQuery,
      variables: { id: mockParams.id }
    },
    result: {
      data: {
        user: {
          id: '800b458a-e527-4410-9ca3-8c0c701045c5',
          __typename: 'User',
          accounts: [
            {
              id: '49b982f0-4856-4e2a-bf86-4b95b0f3a90a',
              updatedAt: '2021-11-15T15:41:42+02:00',
              __typename: 'Account',
              landParcels: []
            }
          ]
        }
      }
    }
  };
  it('should render the buttons', async () => {
    const user = {
      user: {
        ...authState.user,
        userType: 'security_guard'
      }
    }
    const wrapper = render(
      <Context.Provider value={user}>
        <MockedProvider mocks={[mocks, accountMock]} addTypename>
          <MockedThemeProvider>
            <MemoryRouter>
              <UserShow history={{ push: jest.fn() }} />
            </MemoryRouter>
          </MockedThemeProvider>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(wrapper.queryByText('common:misc.log_entry')).toBeInTheDocument();
      expect(wrapper.queryAllByTestId('user_avatar')[0]).toBeInTheDocument();
      expect(wrapper.queryByText('common:user_types.admin')).toBeInTheDocument();
      expect(wrapper.queryByText('x JM J')).toBeInTheDocument();
    }, 10);
  });
});
