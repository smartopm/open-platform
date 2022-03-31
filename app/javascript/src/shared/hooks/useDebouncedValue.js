import { useEffect, useState } from 'react';
import useDebounce from '../../utils/useDebounce';

export default function useDebouncedValue(delay = 500) {
  const [value, setSearchValue] = useState('');
  const dbcSearchTerm = useDebounce(value, delay);

  useEffect(() => {
    setSearchValue(dbcSearchTerm);
  }, [dbcSearchTerm]);

  return [value, setSearchValue];
}
