import React, { useState, useContext } from "react";
import { useQuery } from "react-apollo";
import { Context as AuthStateContext } from "../../../containers/Provider/AuthStateProvider";
import Loading from "../../../shared/Loading";
import { AllEventLogsQuery } from "../../../graphql/queries";
import ErrorPage from "../../../components/Error";
import Events from "./Events"

export default ({ history }) => {
  const authState = useContext(AuthStateContext);
  return AllEventLogs(history, authState);
};
// Todo: Find the total number of allEventLogs
const limit = 30;
const AllEventLogs = (history, authState) => {
  const [offset, setOffset] = useState(0);
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: { subject: null, refId: null, refType: null, offset, limit },
    fetchPolicy: "cache-and-network"
  });
  const { token } = authState;
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
      <Events
        data={data}
        previousPage={handlePreviousPage}
        offset={offset}
        nextPage={handleNextPage}
        router={history}
        userToken={token}
      />
    </>
  );
};