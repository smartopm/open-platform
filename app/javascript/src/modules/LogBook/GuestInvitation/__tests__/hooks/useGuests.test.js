import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { renderHook } from '@testing-library/react-hooks';
import useGuests from '../../hooks/useGuests';
import { SearchGuestsQuery } from '../../graphql/queries';

describe('test useGuests', () => {
  function getHookWrapper(mocks = []) {
    const wrapper = ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );
    const { result, waitForNextUpdate } = renderHook(() => useGuests('some values'), {
      wrapper
    });
    return { result, waitForNextUpdate };
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
    const { result, waitForNextUpdate } = getHookWrapper([guestsQueryMock]);
    await waitForNextUpdate();
    expect(result.current.error).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    await waitForNextUpdate();
    expect(result.current.error).toBeUndefined();
    expect(result.current.data.searchGuests).toEqual([
      { id: 'some id', name: 'some user', imageUrl: null, avatarUrl: null }
    ]);
  });

  it('should return an error when searching when something goes wrong', async () => {
    const guestsQueryMockWithError = {
      request: {
        query: SearchGuestsQuery,
        variables: { query: 'some values' }
      },
      error: new Error('Ooops, something went wrong')
    };
    const { result, waitForNextUpdate } = getHookWrapper([guestsQueryMockWithError]);
    await waitForNextUpdate();
    expect(result.current.loading).toBe(false);
    await waitForNextUpdate();
    expect(result.current.error).toBeDefined();
    expect(result.current.error.message).toContain('Network error: Ooops, something went wrong');
    expect(result.current.data).toBeUndefined();
  });
});
