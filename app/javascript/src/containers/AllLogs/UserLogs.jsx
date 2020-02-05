import React, { useState } from "react";
import { useQuery } from "react-apollo";
import Nav from "../../components/Nav";

import Loading from "../../components/Loading.jsx";
import DateUtil from "../../utils/dateutil.js";
import { AllEventLogsForUserQuery } from "../../graphql/queries.js";
import ErrorPage from "../../components/Error";

export default ({ history, match }) => {
  const subjects = null;
  return allEventLogs(history, match, subjects);
};

// Todo: Find the total number of allEventLogs
const limit = 50;
const allEventLogs = (history, match, subjects) => {
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
    <IndexComponent
      data={data}
      previousPage={handlePreviousPage}
      offset={offset}
      nextPage={handleNextPage}
      router={history}
    />
  );
};

export function IndexComponent({
  data,
  router,
  nextPage,
  previousPage,
  offset
}) {
  function routeToAction(eventLog) {
    if (eventLog.refType === "EntryRequest") {
      return router.push(`/request/${eventLog.refId}`);
    } else if (eventLog.refType === "User") {
      return router.push(`/user/${eventLog.refId}`);
    }
  }
  function logs(eventLogs) {
    if (!eventLogs) {
      return;
    }
    return eventLogs.map(event => {
      return (
        <tr
          key={event.id}
          onClick={() => routeToAction(event)}
          style={{
            cursor: "pointer"
          }}
        >
          <td>{DateUtil.dateToString(new Date(event.createdAt))}</td>
          <td>{DateUtil.dateTimeToString(new Date(event.createdAt))}</td>
          <td>{event.sentence}</td>
        </tr>
      );
    });
  }
  return (
    <div>
      <div
        style={{
          backgroundColor: "#25c0b0"
        }}
      >
        <Nav menuButton="back" navName="Logs" boxShadow={"none"} />
      </div>
      <div className="row justify-content-center">
        <div className="col-10 col-sm-10 col-md-6 table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>{logs(data.result)}</tbody>
          </table>
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${offset < limit && "disabled"}`}>
                <a className="page-link" onClick={previousPage} href="#">
                  Previous
                </a>
              </li>
              <li
                className={`page-item ${data.result.length < limit &&
                  "disabled"}`}
              >
                <a className="page-link" onClick={nextPage} href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
