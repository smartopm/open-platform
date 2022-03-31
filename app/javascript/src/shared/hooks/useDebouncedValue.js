import { useEffect, useState } from 'react';
import useDebounce from '../../utils/useDebounce';

export default function useDebouncedValue(delay = 500) {
  const [value, setSearchValue] = useState('');
  const dbcValue = useDebounce(value, delay);

  useEffect(() => {
    setSearchValue(dbcValue);
  }, [dbcValue]);

  console.log({ dbcValue, value });
  return { value, dbcValue, setSearchValue };
}
