import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types'
import Loading from '../../../shared/Loading';
import { AllEventLogsForUserQuery } from '../../../graphql/queries';
import ErrorPage from '../../../components/Error';
import UserLog from '../Components/UserLog';


export default function UserLogs(){
  const subjects = null;
  const history = useHistory()
  return <AllEventLogs history={history} subjects={subjects} />;
};

const limit = 50;
export function AllEventLogs({ history, subjects }){
  const [offset, setOffset] = useState(0);
  const { id } = useParams()
  const userId = id
  const { loading, error, data } = useQuery(AllEventLogsForUserQuery, {
    variables: { subject: subjects, userId , offset, limit },
    fetchPolicy: 'cache-and-network'
  });
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;
  function handleNextPage() {
    setOffset(offset + limit);
  }
  function handlePreviousPage() {
    if (offset < limit) {
      return;
    }
    setOffset(offset - limit);
  }
  return (
    <UserLog
      data={data}
      previousPage={handlePreviousPage}
      offset={offset}
      limit={limit}
      nextPage={handleNextPage}
      router={history}
    />
  );
};

const props = {
  history: PropTypes.shape({
    push: PropTypes.fund,
  }).isRequired
}

// UserLogs.propTypes = props

AllEventLogs.propTypes = {
  ...props,
  subjects: PropTypes.string
}
AllEventLogs.defaultProps = {
  subjects: null
}