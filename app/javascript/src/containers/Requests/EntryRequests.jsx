import React from "react";
import { useQuery } from "react-apollo";
import Nav from "../../components/Nav";

import Loading from "../../components/Loading.jsx";
import DateUtil from "../../utils/dateutil.js";
import { AllEntryRequestsQuery } from "../../graphql/queries.js";
import ErrorPage from "../../components/Error";

export default () => {
  return allEntryRequests();
};

const allEntryRequests = () => {
  const { loading, error, data } = useQuery(AllEntryRequestsQuery, {
    fetchPolicy: "no-cache"
  });
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;

  return <IndexComponent data={data} />;
};

export function IndexComponent({ data }) {
  function logs(entries) {
    return entries.map(entry => (
      <tr key={entry.id}>
        <td>{entry.name}</td>
        <td>{entry.guard.name}</td>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{entry.phoneNumber}</td>
        <td>{entry.nrc}</td>
        <td>{entry.vehiclePlate}</td>
        <td>{entry.reason}</td>
        <td>
          {["Pending", "Granted", "Denied"][entry.grantedState] || "Pending"}
        </td>
      </tr>
    ));
  }
  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-10 col-sm-10 col-md-6">
          <table className="table table-responsive">
            <thead>
              <tr>
                <th scope="col">Visitor</th>
                <th scope="col">Guard</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Phone Number</th>
                <th scope="col">NRC</th>
                <th scope="col">Vehicle</th>
                <th scope="col">Reason</th>
                <th scope="col">State</th>
              </tr>
            </thead>
            <tbody>{logs(data.result)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function UserComponent({ data }) {
  function logs(entries) {
    return entries.map(entry => (
      <tr key={entry.id}>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{entry.reportingUser.name}</td>
      </tr>
    ));
  }

  return (
    <div>
      <Nav menuButton="back" />
      <div className="row justify-content-center">
        <div className="col-10 col-sm-10 col-md-6">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Reporter</th>
              </tr>
            </thead>
            <tbody>{logs(data.entryLogs)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
