import { useEffect } from 'react';
import { useLazyQuery } from 'react-apollo';
import { SearchGuestsQuery } from '../graphql/queries';
import useDebounce from '../../../../utils/useDebounce';

export default function useGuests(searchValue) {
  const debouncedValue = useDebounce(searchValue, 500);
  const [searchGuests, { data, loading, error }] = useLazyQuery(SearchGuestsQuery, {
    variables: { query: debouncedValue.trim() },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (searchValue) {
      searchGuests();
    }
  }, [debouncedValue]);

  return { data, loading, error };
}
