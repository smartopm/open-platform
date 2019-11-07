import React from 'react';
import { useQuery } from 'react-apollo';
import Nav from '../components/Nav'

import Loading from "../components/Loading.jsx";
import DateUtil from "../utils/dateutil.js";
import {AllEntryLogsQuery, EntryLogsQuery}  from "../graphql/queries.js"

export default ({ match }) => {
  if (match.params.userId) {
    return userEntryLogs(match.params.userId)
  } else {
    return allEntryLogs()
  }
}

const userEntryLogs = (userId) => {
  const { loading, error, data } = useQuery(EntryLogsQuery, {variables: {userId}, fetchPolicy: 'no-cache'});
  if (loading) return <Loading />;
  if (error) return `Error! ${error}`;

  return <UserComponent data={data} />
}

const allEntryLogs = () => {
  const { loading, error, data } = useQuery(AllEntryLogsQuery, {fetchPolicy: 'no-cache'});
  if (loading) return <Loading />;
  if (error) return `Error! ${error}`;

  return <IndexComponent data={data} />
}

export function IndexComponent({ data }) {
  function logs(entries) {
    return entries.map((entry) =>
      <tr key={entry.id}>
        <td>{entry.user.name}</td>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{entry.reportingUser.name}</td>
      </tr>
      )
  }
  return (
    <div>
      <Nav menuButton='back'/>
      <div className="row justify-content-center">
        <div className="col-10 col-sm-10 col-md-6">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Visitor</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Reporter</th>
              </tr>
            </thead>
            <tbody>
              {logs(data.entryLogs)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function UserComponent({ data }) {
  function logs(entries) {
    return entries.map((entry) =>
      <tr key={entry.id}>
        <td>{DateUtil.dateToString(new Date(entry.createdAt))}</td>
        <td>{DateUtil.dateTimeToString(new Date(entry.createdAt))}</td>
        <td>{entry.reportingUser.name}</td>
      </tr>
      )
  }

  return (
    <div>
      <Nav menuButton='back'/>
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
            <tbody>
              {logs(data.entryLogs)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
