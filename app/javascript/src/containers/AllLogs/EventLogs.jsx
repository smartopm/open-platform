import React, { useState, useContext } from "react";
import { useQuery } from "react-apollo";
import Nav from "../../components/Nav";
import { Context as AuthStateContext } from "../Provider/AuthStateProvider.js";

import Loading from "../../components/Loading.jsx";
import DateUtil from "../../utils/dateutil.js";
import { AllEventLogsQuery } from "../../graphql/queries.js";
import ErrorPage from "../../components/Error";

export default ({ history }) => {
  const authState = useContext(AuthStateContext);
  return allEventLogs(history, authState);
};

// Todo: Find the total number of allEventLogs
const limit = 30
const allEventLogs = (history, authState) => {
  const [offset, setOffset] = useState(0)
  // const eventsPage = 
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: { subject: null, refId: null, refType: null, offset, limit },
    fetchPolicy: "cache-and-network"
  });
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;

  function handleNextPage() {
    setOffset(offset + limit)
  }
  function handlePreviousPage() {
    if (offset < limit) {
      return;
    }
    setOffset(offset - limit)
  }
  return <IndexComponent data={data} previousPage={handlePreviousPage} offset={offset} nextPage={handleNextPage} router={history} userToken={authState.token} />;
};

export function IndexComponent({ data, router, nextPage, previousPage, offset, userToken }) {

  function logs(eventLogs) {
    if (!eventLogs) {
      return;
    }
    return eventLogs.map(entry => (
      <tr
        key={entry.id}
      >
        <td>{entry.subject}</td>
        <td>{entry.sentence}</td>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
      </tr>
    ));
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
      <div><a href={`/csv_export/event_logs?token=${userToken}`}>Download</a></div>
      <div className="row justify-content-center">
        <div className="col-10 col-sm-10 col-md-6 table-responsive">
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
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${(offset < limit) && 'disabled'}`}>
                <a className="page-link" onClick={previousPage} href="#">Previous</a>
              </li>
              <li className={`page-item ${(data.result.length < limit) && 'disabled'}`}>
                <a className="page-link" onClick={nextPage} href="#">Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
