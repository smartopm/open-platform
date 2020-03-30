import React, { useState, useContext } from "react";
import { useQuery } from "react-apollo";
import Nav from "../../components/Nav";
import { Context as AuthStateContext } from "../Provider/AuthStateProvider.js";
import Loading from "../../components/Loading.jsx";
import DateUtil from "../../utils/dateutil.js";
import { AllEventLogsQuery } from "../../graphql/queries.js";
import ErrorPage from "../../components/Error";
import GetAppIcon from '@material-ui/icons/GetApp';
import Fab from "@material-ui/core/Fab";

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
    <IndexComponent
      data={data}
      previousPage={handlePreviousPage}
      offset={offset}
      nextPage={handleNextPage}
      router={history}
      userToken={authState.token}
    />
  );
};

export function IndexComponent({
  data,
  nextPage,
  previousPage,
  offset,
  userToken
}) {
  function logs(eventLogs) {
    if (!eventLogs) {
      return;
    }
    return eventLogs.map(entry => (
      <tr key={entry.id}>
        <td>{entry.subject}</td>
        <td>
          {
            entry.subject === 'user_feedback' ? `${entry.sentence} ${entry.data.note}` : entry.sentence
          }
        </td>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{entry.subject === 'user_entry' && entry.data.digital !== null ? `${entry.data.digital ? 'Digital' : 'Print'} Scan` : 'N/A'}</td>
        <td>{entry.subject === 'user_entry' && entry.data.timestamp
          ? `${entry.data.timestamp && `${new Date(Number(entry.data.timestamp)).toLocaleDateString()} 
            ${new Date(Number(entry.data.timestamp)).toLocaleTimeString()}`} ` : 'N/A'}</td>
        <td>{entry.data ? entry.data.type : 'Entry Request'}</td>
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
      <div className="row justify-content-center">
        <div className="col-11 col-sm-11 table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Subject</th>
                <th scope="col">Description</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Scan Type</th>
                <th scope="col">QR Timestamp</th>
                <th scope="col">User Type</th>
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
        <Fab
          variant="extended"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 57,
            backgroundColor: 'rgb(37, 192, 176)',
            color: '#FFFFFF'
          }}
          href={`/csv_export/event_logs?token=${userToken}`}
        >
          <GetAppIcon />
          {' '}Download
      </Fab>
      </div>
    </div >
  );
}
