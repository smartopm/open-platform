import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { renderHook } from '@testing-library/react-hooks';
import useUsers from '../../hooks/useUsers';
import { UsersDetails } from '../../../../../graphql/queries';

describe('test useUser', () => {
  function apolloHookWrapper(mocks = []) {
    const wrapper = ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );
    const { result, waitForNextUpdate, waitFor } = renderHook(() => useUsers('Anonymous'), {
      wrapper,
    });
    return { result, waitForNextUpdate, waitFor };
  }

  const userQueryMock = {
    request: {
      query: UsersDetails,
      variables: { query: 'Anonymous', limit: 10, offset: 0 },
    },
    result: {
      data: {
        users: [
          {
            name: 'Anonymous',
            phoneNumber: '3221038192389',
            roleName: 'Visitor',
            userType: 'visitor',
            id: '630d8061-8c23-4146-b1c0-a0da223e6402',
            email: null,
            avatarUrl: null,
            imageUrl: null,
            subStatus: null,
            extRefId: null,
            expiresAt: null,
            status: 'active',
            state: 'pending',
            labels: [
              {
                id: '059956af-b346-4e0d-9d1e-56cf22379ad7',
                shortDesc: 'weekly_point_reminder_email',
                groupingName: 'Status',
              },
            ],
          },
        ],
      },
    },
  };

  it('should return a searched user', async () => {
    const { result, waitFor } = apolloHookWrapper([userQueryMock]);

    await waitFor(() => {
      expect(result?.current?.userSearchLoading).toBe(false);
      expect(result?.current?.userSearchError).toBeUndefined();
      expect(result?.current?.userSearchData).toBeDefined();
    });
  });
});
