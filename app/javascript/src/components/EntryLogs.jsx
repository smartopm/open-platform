import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from "./Loading.jsx";
import DateUtil from "../utils/dateutil.js";

const QUERY = gql`
query EntryLogs($memberId: ID!) {
  entryLogs(memberId: $memberId) {
    id
    createdAt
    note
    reportingMember {
      user {
        name
      }
    }
  }
}
`;

function createdAtDateStr(datetime) {
  const date = DateUtil.fromISO8601(datetime)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

function createdAtTimeStr(datetime) {
  const date = DateUtil.fromISO8601(datetime)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

export default ({ match }) => {
  let memberId = match.params.memberId
  console.log()
  const { loading, error, data } = useQuery(QUERY, {variables: {memberId}});
  if (loading) return <Loading />;
  if (error) return `Error! ${error}`;

  return <Component data={data} />
}

function logs(entries) {
  return entries.map((entry) =>
    <tr key={entry.id}>
      <td>{DateUtil.dateToString(entry.createdAt)}</td>
      <td>{DateUtil.dateTimeToString(entry.createdAt)}</td>
      <td>{entry.reportingMember.user.name}</td>
      <td>{entry.note}</td>
    </tr>
    )
}

export function Component({ data }) {
  return (
    <div className="row justify-content-center">
      <div className="col-10 col-sm-10 col-md-6">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Reporter</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs(data.entryLogs)}
          </tbody>
        </table>
      </div>
    </div>
  );
};
