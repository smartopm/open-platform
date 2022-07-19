import { useEffect } from 'react';
import { useLazyQuery } from 'react-apollo';
import { UsersDetails } from '../../../../graphql/queries';
import useDebounce from '../../../../utils/useDebounce';

export default function useUser(searchValue) {
  const debouncedValue = useDebounce(searchValue, 500);
  const [
    searchUsers,
    { data: userSearchData, loading: userLoading, error: userError },
  ] = useLazyQuery(UsersDetails, {
    variables: { query: debouncedValue, limit: 10 },
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (searchValue) {
      searchUsers();
    }
  }, [debouncedValue]);

  return { userSearchData, userLoading, userError };
}
