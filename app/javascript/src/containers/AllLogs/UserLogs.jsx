import React, { useState } from "react";
import { useQuery } from "react-apollo";
import Nav from "../../components/Nav";
import Loading from "../../components/Loading.jsx";
import { AllEventLogsForUserQuery } from "../../graphql/queries.js";
import ErrorPage from "../../components/Error";
import UserLog from "../../components/UserLog"
export default ({ history, match }) => {
  const subjects = null;
  return AllEventLogs(history, match, subjects);
};

// Todo: Find the total number of AllEventLogs
const limit = 50;
const AllEventLogs = (history, match, subjects) => {
  const [offset, setOffset] = useState(0);
  const userId = match.params.id || null;
  const { loading, error, data } = useQuery(AllEventLogsForUserQuery, {
    variables: { subject: subjects, userId, offset, limit },
    fetchPolicy: "cache-and-network"
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
    <>
     <Nav menuButton="back" navName="Logs" boxShadow={"none"}  backTo={`/user/${userId}`} />
    <UserLog
      data={data}
      previousPage={handlePreviousPage}
      offset={offset}
      limit = {limit}
      nextPage={handleNextPage}
      router={history}
    />
    </>
  );
};


