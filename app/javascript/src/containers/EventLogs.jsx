import React from "react";
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
  const { loading, error, data } = useQuery(AllEventLogsQuery, {
    variables: {subject: null, refId: null, refType: null},
    fetchPolicy: "no-cache"
  });
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;

  return <IndexComponent data={data} router={history} />;
};

export function IndexComponent({ data, router }) {

  function routeToAction(eventLog) {
    if (eventLog.refType === 'EntryRequest') {
      return router.push(`/entry_request/${eventLog.refId}`);
    } else if (eventLog.refType === 'User') {
      return router.push(`/user/${eventLog.refId}`);
    }
  }
  function logs(eventLogs) {
    // we could add this as an early exit to avoid breakage
    // if (!eventLogs || eventLogs.length) {
    //   return;
    // }
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
        </div>
      </div>
    </div>
  );
}
