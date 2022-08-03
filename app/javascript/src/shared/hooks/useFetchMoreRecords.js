import {  useState } from 'react';
import { objectAccessor } from '../../utils/helpers';
/**
 * A wrapper around apollo fetchMore function 
 * @param {Function} fetcher - Apollo fetchMore function that retries new data - 
 * const { data, fetchMore } = useQuery(Query)
 * @param {String} dataKey - Identifier in your GraphQL Query, Your data.dataKey
 * @param {{ offset: Number,  }} variables - Your new variables to use, offset should be provided 
 * @return {Promise}
 */ 
export default function useFetchMoreRecords(fetcher, dataKey, variables) {
  const [hasMoreRecord, setHasMoreRecord] = useState(true);

  function fetchMoreRecord() {
    return fetcher({
      variables: { ...variables },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!objectAccessor(fetchMoreResult, dataKey).length) {
          setHasMoreRecord(false);
          return prev;
        }
        return {
          ...prev,
          [dataKey]: [
            ...objectAccessor(prev, dataKey),
            ...objectAccessor(fetchMoreResult, dataKey),
          ],
        };
      },
    });
  }
  return { loadMore: fetchMoreRecord, hasMoreRecord };
}
