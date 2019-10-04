import React, {useContext} from 'react';
import { Redirect, Link } from "react-router-dom";
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import {Context as AuthStateContext} from './Provider/AuthStateProvider.js';

import Loading from "./Loading.jsx";
import Nav from "./Nav.jsx";
import DateUtil from "../utils/dateutil.js";

const QUERY = gql`
query Member($id: ID!) {
  member(id: $id) {
    id
    memberType
    expiresAt
    lastActivityAt
    user {
      name
      email
      id
    }
  }
}
`;

const LOG_ENTRY = gql`
mutation ActivityLogMutation($memberId: ID!, $note: String) {
  activityLogAdd(memberId: $memberId, note: $note) {
    id
  }
}
`;

function expiresAtStr(datetime) {
  if (datetime) {
    const date = DateUtil.fromISO8601(datetime)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
  return "Never"
}

export default ({match}) => {
  const id = match.params.id
  const authState = useContext(AuthStateContext)
  const { loading, error, data } = useQuery(QUERY, {variables: {id}});
  const [addLogEntry, entry] = useMutation(LOG_ENTRY, {variables: {memberId: id}});
  if (loading || entry.loading) return <Loading />;
  if (entry.data) return <Redirect to="/scan" />
  if (error) return `Error! ${error}`;
  return (<Component data={data} authState={authState} onLogEntry={addLogEntry}/>)
}

export function Component({ data, onLogEntry }) {
  return (
    <div>
      <Nav navName="Identification" menuButton="cancel" />
      <div className="row justify-content-center id_card">
        <div className="card id_card_box col-10 col-sm-10 col-md-6">
          <div className="d-flex justify-content-center">
            <div className="member_type">{data.member.member_type}</div>
          </div>
          <div className="d-flex justify-content-center">
            <img src="/images/default_avatar.svg" />
          </div>
          <div className="d-flex justify-content-center">
            <h1>{data.member.user.name}</h1>
          </div>
          <div className="d-flex justify-content-center">
            <div className="expires">Exp: {expiresAtStr(data.member.expiresAt)}</div>
          </div>
          <div className="d-flex justify-content-center last_accessed">
            <div className="expires">Last accessed: {expiresAtStr(data.member.lastActivityAt)}</div>
          </div>

          <div className="d-flex justify-content-center">
            { data.member.expiresAt && DateUtil.isExpired(DateUtil.fromISO8601(data.member.expiresAt)) ? 
            <span className="badge badge-danger">Expired</span> :
            <span className="badge badge-success"><span className="oi oi-circle-check"></span> Valid</span>
            }
          </div>

          <div className="d-flex justify-content-center">
            <Link to={`/entry_logs/${data.member.id}`}>Entry Logs <span className="oi oi-chevron-right"></span></Link>
          </div>

        </div>

    </div>

    <div className="row justify-content-center log-entry-form">
      <div className="col-10 col-sm-10 col-md-6">
        <a className="btn btn-primary btn-lg btn-block active" onClick={onLogEntry}>Log an entry</a>
      </div>
    </div>
  </div>
  )
}
