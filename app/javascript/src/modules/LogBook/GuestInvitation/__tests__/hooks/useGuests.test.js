import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { renderHook } from '@testing-library/react-hooks';
import useGuests from '../../hooks/useGuests';
import { SearchGuestsQuery } from '../../graphql/queries';

describe('test useGuests', () => {
  // TODO: find ways to share this hookWrapper 
  function apolloHookWrapper(mocks = []) {
    const wrapper = ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );
    const { result, waitForNextUpdate, waitFor } = renderHook(() => useGuests('some values'), {
      wrapper
    });
    return { result, waitForNextUpdate, waitFor };
  }

  const guestsQueryMock = {
    request: {
      query: SearchGuestsQuery,
      variables: { query: 'some values' }
    },
    result: {
      data: {
        searchGuests: [
          {
            id: 'some id',
            name: 'some user',
            imageUrl: null,
            avatarUrl: null
          }
        ]
      }
    }
  };

  it('should return a searched user', async () => {
    const { result, waitFor } = apolloHookWrapper([guestsQueryMock]);
    
    await waitFor(() => {
    expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeUndefined();
      expect(result.current.data.searchGuests).toEqual([
        { id: 'some id', name: 'some user', imageUrl: null, avatarUrl: null }
      ]);
    }, 50)
  });

  it('should return an error when searching when something goes wrong', async () => {
    const guestsQueryMockWithError = {
      request: {
        query: SearchGuestsQuery,
        variables: { query: 'some values' }
      },
      error: new Error('Ooops, something went wrong')
    };
    const { result, waitFor } = apolloHookWrapper([guestsQueryMockWithError]);
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeDefined();
      expect(result.current.error.message).toContain('Network error: Ooops, something went wrong');
      expect(result.current.data).toBeUndefined();
    }, 50)
  });
});
