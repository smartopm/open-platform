import React, { useState, useContext } from "react";
import { useQuery } from "react-apollo";
import Nav from "../../components/Nav";
import { Context as AuthStateContext } from "../Provider/AuthStateProvider.js";
import Loading from "../../components/Loading.jsx";
import { AllEventLogsQuery } from "../../graphql/queries.js";
import ErrorPage from "../../components/Error";
import Events from "../../components/Events"

export default ({ history }) => {
  const authState = useContext(AuthStateContext);
  return allEventLogs(history, authState);
};

// Todo: Find the total number of allEventLogs
const limit = 30;
const allEventLogs = (history, authState) => {
  const [offset, setOffset] = useState(0);
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: { subject: null, refId: null, refType: null, offset, limit },
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
    <Nav menuButton="back" navName="Logs" boxShadow={"none"}  backTo="/"/>
    <Events
      data={data}
      previousPage={handlePreviousPage}
      offset={offset}
      nextPage={handleNextPage}
      router={history}
      userToken={authState.token}
    />
    </>
  );
};


