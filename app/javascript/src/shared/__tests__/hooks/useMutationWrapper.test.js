import { MockedProvider } from '@apollo/react-testing';
import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';
import { AmenityCreateMutation } from '../../../modules/Amenity/graphql/amenity_mutations';
import MockedSnackbarProvider from '../../../modules/__mocks__/mock_snackbar';
import useMutationWrapper from '../../hooks/useMutationWrapper';

describe('useMutationWrapper hook', () => {
  const updateQuery = {
    request: {
      query: AmenityCreateMutation
    },
    result: {
      data: {
        amenityCreate: {
          success: true
        }
      }
    }
  };
  const reset = jest.fn();
  function apolloHookWrapper(mocks = []) {
    const wrapper = ({ children }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        <MockedSnackbarProvider>{children}</MockedSnackbarProvider>
      </MockedProvider>
    );
    const { result, waitForNextUpdate, waitFor } = renderHook(
      () => useMutationWrapper(AmenityCreateMutation, reset),
      { wrapper }
    );
    return { result, waitForNextUpdate, waitFor };
  }
  it('should return a function and a loading state', async () => {
    const { result, waitFor, waitForNextUpdate } = apolloHookWrapper([updateQuery]);
    expect(result.current[0]).toBeInstanceOf(Function);
    expect(result.current[1]).toBe(false); // initially false

    const callMutation = result.current[0];
    act(() => callMutation({ name: 'some name' }));  
    waitForNextUpdate();      
    await waitFor(() => {
      expect(result.current[1]).toBe(true); // true after calling the mutation
    }, 10);
  });
});
