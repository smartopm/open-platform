import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import Nav from '../components/Nav'

import Loading from "../components/Loading.jsx";
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

export default ({ match }) => {
  let memberId = match.params.memberId
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
                <th scope="col">Notes</th>
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
