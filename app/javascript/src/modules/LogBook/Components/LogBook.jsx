/* eslint-disable max-lines */
/* eslint-disable max-statements */
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { useParams, useHistory } from 'react-router-dom';
import { useParamsQuery, objectAccessor, handleQueryOnChange } from '../../../utils/helpers';
import { AllEventLogsQuery } from '../../../graphql/queries';
import useDebounce from '../../../utils/useDebounce';
import {
  entryLogsFilterFields,
} from '../../../utils/constants';
import LogBookItem from './LogBookItem'

const limit = 20;
export default function LogBook() {
  const history = useHistory()
  const { userId }  = useParams()
  const subjects = ['user_entry', 'visitor_entry', 'user_temp', 'observation_log'];
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState(7);
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const path = useParamsQuery();
  const tabValue = path.get('tab');
  const [value, setvalue] = useState(Number(tabValue) || 0);
  const dbcSearchTerm = useDebounce(searchTerm, 500);

  const refId = userId || null;

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

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none');
    } else {
      setDisplayBuilder('');
    }
  }

  const logsQuery = {
    0: subjects,
    1: 'visit_request',
    2: 'visit_request',
  };

  const { loading, error, data, refetch } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: objectAccessor(logsQuery, value),
      refId,
      refType: null,
      offset,
      limit,
      name: value !== 2 ? dbcSearchTerm.trim() : ''
    },
    fetchPolicy: 'cache-and-network'
  });

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handleSearchClear() {
    setSearchTerm('');
  }

  function queryOnChange(selectedOptions) {
    setSearchQuery(handleQueryOnChange(selectedOptions, entryLogsFilterFields));
    setScope(null)
  }

  function handleChange(_event, newValue) {
    setvalue(newValue);
    setSearchTerm('');
    // reset pagination after changing the tab
    history.push(`/logbook?tab=${newValue}&offset=${0}`);
  }
  return (
    <LogBookItem
      data={data?.result}
      offset={offset}
      router={history}
      scope={scope}
      searchTerm={searchTerm}
      searchQuery={searchQuery}
      handleSearch={handleSearch}
      toggleFilterMenu={toggleFilterMenu}
      handleSearchClear={handleSearchClear}
      displayBuilder={displayBuilder}
      queryOnChange={queryOnChange}
      handleTabValue={handleChange}
      tabValue={value}
      loading={loading}
      refetch={refetch}
      error={error?.message}
    />
  );
}