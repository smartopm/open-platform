import React, { useState } from "react";
import { useQuery } from "react-apollo";
import Nav from "../components/Nav";

import Loading from "../components/Loading.jsx";
import DateUtil from "../utils/dateutil.js";
import { AllEventLogsQuery } from "../graphql/queries.js";
import ErrorPage from "../components/Error";

export default ({ history }) => {
  return allEventLogs(history);
};

const allEventLogs = (history) => {
  const [offset, setOffset] = useState(0)
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: { subject: null, refId: null, refType: null, offset, limit: 5 },
    fetchPolicy: "cache-and-network"
  });
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;

  function handleNextPage() {
    setOffset(offset + 5)
  }
  function handlePreviousPage() {
    setOffset(offset - 5)
  }

  return <IndexComponent data={data} offset={offset} previousPage={handlePreviousPage} nextPage={handleNextPage} router={history} />;
};

export function IndexComponent({ data, router, nextPage, previousPage }) {

  function routeToAction(eventLog) {
    if (eventLog.refType === 'EntryRequest') {
      return router.push(`/entry_request/${eventLog.refId}`);
    } else if (eventLog.refType === 'User') {
      return router.push(`/user/${eventLog.refId}`);
    }
  }
  function logs(eventLogs) {
    if (!eventLogs) {
      return;
    }
    return eventLogs.map(entry => (
      <tr
        key={entry.id}
        onClick={() => routeToAction(entry)}
        style={{
          cursor: "pointer"
        }}
      >
        <td>{entry.subject}</td>
        <td>{entry.sentence}</td>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
      </tr>
    ));
  }
  console.log(data.result);
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
        <div className="col-10 col-sm-10 col-md-6">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Subject</th>
                <th scope="col">Description</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>{logs(data.result)}</tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" onClick={previousPage} href="#">Previous</a>
              </li>
              <li className="page-item"><a className="page-link" onClick={nextPage} href="#">Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
