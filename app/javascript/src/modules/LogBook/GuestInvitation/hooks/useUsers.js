import { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { UsersDetails } from '../../../../graphql/queries';
import useDebounce from '../../../../utils/useDebounce';

export default function useUsers(searchValue) {
  const debouncedValue = useDebounce(searchValue, 1000);
  const {
    data: userSearchData,
    loading: userSearchLoading,
    error: userSearchError,
    refetch,
  } = useQuery(UsersDetails, {
    variables: { query: debouncedValue, limit: 10 },
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (searchValue) {
      refetch();
    }
  }, [debouncedValue]);

  return { userSearchData, userSearchLoading, userSearchError };
}
