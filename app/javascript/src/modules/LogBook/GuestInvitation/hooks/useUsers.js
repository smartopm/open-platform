import { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { UsersDetails } from '../../../../graphql/queries';
import useDebounce from '../../../../utils/useDebounce';

// Todo: Daniel merge with useGuests hook
export default function useUsers(searchValue) {
  const debouncedValue = useDebounce(searchValue, 1000);
  const {
    data: userSearchData,
    loading: userSearchLoading,
    error: userSearchError,
    refetch,
  } = useQuery(UsersDetails, {
    variables: { limit: 10, offset: 0, query: debouncedValue },
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (searchValue) {
      refetch();
    }
  }, [debouncedValue]);

  return { userSearchData, userSearchLoading, userSearchError };
}
