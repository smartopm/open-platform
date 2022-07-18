import { useEffect } from 'react';
import { useLazyQuery } from 'react-apollo';
import { UsersLiteQuery } from '../../../../graphql/queries';
import useDebounce from '../../../../utils/useDebounce';

export default function useUser(searchValue) {
  const debouncedValue = useDebounce(searchValue, 500);
  const [searchUsers, { data, loading, error }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: debouncedValue, limit: 10 },
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (searchValue) {
      searchUsers();
    }
  }, [debouncedValue]);

  return { data, loading, error };
}
