/* eslint-disable */
import React from "react";
import { useQuery } from "react-apollo";
import Nav from "../../components/Nav";
import Loading from "../../components/Loading.jsx";
import { AllEntryRequestsQuery } from "../../graphql/queries.js";
import ErrorPage from "../../components/Error";
import { dateToString, dateTimeToString } from "../../components/DateContainer";

export default () => {
  return AllEntryRequests();
};

const AllEntryRequests = () => {
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
      <tr data-testid="entry_row" key={entry.id}>
        <td data-testid="entry_name">{entry.name}</td>
        <td data-testid="entry_guard">{entry.guard.name}</td>
        <td>{dateToString(entry.createdAt)}</td>
        <td>{dateTimeToString(new Date(entry.createdAt))}</td>
        <td data-testid="entry_phone">{entry.phoneNumber}</td>
        <td data-testid="entry_nrc">{entry.nrc}</td>
        <td>{entry.vehiclePlate}</td>
        <td data-testid="entry_reason">{entry.reason}</td>
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
        <td>{dateToString(entry.createdAt)}</td>
        <td>{dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{entry.reportingUser.name}</td>
      </tr>
    ));
  }

  return (
    <div>
      <Nav menuButton="back" backTo="/"/>
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
