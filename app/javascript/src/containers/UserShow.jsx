import React, {useContext} from 'react';
import { Redirect, Link } from "react-router-dom";
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { StyleSheet, css } from 'aphrodite';

import {Context as AuthStateContext} from './Provider/AuthStateProvider.js';

import Nav from '../components/Nav'
import Loading from "../components/Loading.jsx";
import Status from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import DateUtil from "../utils/dateutil.js";

const QUERY = gql`
query User($id: ID!) {
  user(id: $id) {
    id
    userType
    state
    expiresAt
    lastActivityAt
    name
    email
    imageUrl
  }
}
`;

const LOG_ENTRY = gql`
mutation ActivityLogMutation($userId: ID!, $note: String) {
  activityLogAdd(userId: $userId, note: $note) {
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
  const [addLogEntry, entry] = useMutation(LOG_ENTRY, {variables: {userId: id}});
  if (loading || entry.loading) return <Loading />;
  if (entry.data) return <Redirect to="/" />
  if (error) return `Error! ${error}`;
  return (<Component data={data} authState={authState} onLogEntry={addLogEntry}/>)
}

const avatarURL = (imageURL) => {
  if (imageURL) {
    return imageURL
  } else {
    return '/images/default_avatar.svg'
  }
}

export function Component({ data, onLogEntry }) {
  return (
    <div>
      <Nav navName="Identification" menuButton="cancel" />
      <div className="container">
        <div className="row justify-content-center id_card">
          <div className="card id_card_box col-10 col-sm-10 col-md-6">
            <div className="d-flex justify-content-center">
              <div className="member_type">{data.user.userType}</div>
            </div>
            <Avatar imageURL={data.user.imageUrl} style='big' />
            <div className="d-flex justify-content-center">
              <h1>{data.user.name}</h1>
            </div>
            <div className="d-flex justify-content-center">
              <div className="expires">Exp: {expiresAtStr(data.user.expiresAt)}</div>
            </div>
            <div className="d-flex justify-content-center last_accessed">
              <div className="expires">Last accessed: {expiresAtStr(data.user.lastActivityAt)}</div>
            </div>

            <div className="d-flex justify-content-center">
              <Status label={data.user.state}/>
            </div>

            <div className="d-flex justify-content-center">
              <Link to={`/entry_logs/${data.user.id}`}>Entry Logs <span className="oi oi-chevron-right"></span></Link>
            </div>

          </div>

      </div>

      <div className="row justify-content-center log-entry-form">
        <div className="col-10 col-sm-10 col-md-6">
          <a className="btn btn-primary btn-lg btn-block active" onClick={onLogEntry}>Log an entry</a>
        </div>
      </div>

      <div className="row justify-content-center log-entry-form">
        <div className="col-10 col-sm-10 col-md-6">
          <Link to={`/user/${data.user.id}/edit`} className="btn btn-primary btn-lg btn-block active">Edit</Link>
        </div>
      </div>

    </div>
  </div>
  )
}

const styles = StyleSheet.create({
  avatar: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '8px',
  },
})
