import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { useParams, useHistory } from 'react-router-dom';
import { useParamsQuery, objectAccessor } from '../../../utils/helpers';
import { AllEventLogsQuery } from '../../../graphql/queries';
import useDebounce from '../../../utils/useDebounce';
import LogBookItem from './LogBookItem'

const limit = 20;
export default function LogBook() {
  const history = useHistory()
  const { userId }  = useParams()
  const subjects = ['user_entry', 'visitor_entry', 'user_temp', 'observation_log'];
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
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

  const logsQuery = {
    0: subjects,
    1: 'visit_request',
    2: 'visit_request',
  };

  // const { loading, error, data, refetch } = useQuery(AllEventLogsQuery, {
  //   variables: {
  //     subject: objectAccessor(logsQuery, value),
  //     refId,
  //     refType: null,
  //     offset,
  //     limit,
  //     name: value !== 2 ? dbcSearchTerm.trim() : ''
  //   },
  //   fetchPolicy: 'cache-and-network'
  // });


  function handleChange(_event, newValue) {
    setvalue(newValue);
    setSearchTerm('');
    // reset pagination after changing the tab
    history.push(`/logbook?tab=${newValue}&offset=${0}`);
  }
  return (
    <LogBookItem
      // data={data?.result}
      offset={offset}
      router={history}
      // searchTerm={searchTerm}
      handleTabValue={handleChange}
      tabValue={value}
      // loading={loading}
      // refetch={refetch}
      // error={error?.message}
    />
  );
}