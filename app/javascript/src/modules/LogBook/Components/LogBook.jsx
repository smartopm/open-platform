import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useParamsQuery } from '../../../utils/helpers';
import LogBookItem from './LogBookItem';
import PageWrapper from '../../../shared/PageWrapper';

export default function LogBook() {
  const history = useHistory();
  const [offset, setOffset] = useState(0);
  const path = useParamsQuery();
  const tabValue = path.get('tab');
  const [value, setvalue] = useState(Number(tabValue) || 0);

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
    // reset pagination after changing the tab
    history.push(`/logbook?tab=${newValue}&offset=${0}`);
  }
  return (
    <PageWrapper>
      <LogBookItem
        offset={offset}
        router={history}
        handleTabValue={handleChange}
        tabValue={value}
      />
    </PageWrapper>
  );
}
