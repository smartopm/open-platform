import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useParamsQuery } from '../../../utils/helpers';
import useDebounce from '../../../utils/useDebounce';
import LogBookItem from './LogBookItem'

export default function LogBook() {
  const history = useHistory()
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const path = useParamsQuery();
  const tabValue = path.get('tab');
  const [value, setvalue] = useState(Number(tabValue) || 0);
  const dbcSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearchTerm(dbcSearchTerm);

  }, [dbcSearchTerm]);

  const query = useParamsQuery();

  useEffect(() => {
    const offsetParams = query.get('offset');
    if (offsetParams) {
      setOffset(Number(offsetParams));
    }
  }, [query]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [offset]);


  function handleChange(_event, newValue) {
    setvalue(newValue);
    setSearchTerm('');
    // reset pagination after changing the tab
    history.push(`/logbook?tab=${newValue}&offset=${0}`);
  }
  return (
    <LogBookItem
      offset={offset}
      router={history}
      handleTabValue={handleChange}
      tabValue={value}
    />
  );
}