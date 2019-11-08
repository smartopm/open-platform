import React, { Fragment, useContext } from "react";
import { Redirect, Link } from "react-router-dom";
import { useQuery, useMutation } from "react-apollo";

import { Context as AuthStateContext } from "./Provider/AuthStateProvider.js";

import Nav from "../components/Nav";
import Loading from "../components/Loading.jsx";
import Status from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import DateUtil from "../utils/dateutil.js";

import { UserQuery } from "../graphql/queries";
import { AddActivityLog } from "../graphql/mutations";
import { css, StyleSheet } from "aphrodite";

function expiresAtStr(datetime) {
  if (datetime) {
    const date = DateUtil.fromISO8601(datetime);
    return (
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
  }
  return "Never";
}

export default ({ match }) => {
  const id = match.params.id;
  const authState = useContext(AuthStateContext);
  const { loading, error, data } = useQuery(UserQuery, { variables: { id } });
  const [addLogEntry, entry] = useMutation(AddActivityLog, {
    variables: { userId: id }
  });
  if (loading || entry.loading) return <Loading />;
  if (entry.data) return <Redirect to="/" />;
  if (error) return `Error! ${error}`;
  return (
    <Component data={data} authState={authState} onLogEntry={addLogEntry} />
  );
};

export function Component({ data, onLogEntry, authState}) {
  return (
    <div>
      <Nav navName="Identification" menuButton="cancel" />
      <div className="container">
        <div className="row justify-content-center id_card">
          <div className="card id_card_box col-10 col-sm-10 col-md-6">
            <div className="d-flex justify-content-center">
              <div className="member_type">{data.user.userType}</div>
            </div>
            <Avatar user={data.user} style="big" />
            <div className="d-flex justify-content-center">
              <h1>{data.user.name}</h1>
            </div>
            <div className="d-flex justify-content-center">
              <div className="expires">
                Exp: {expiresAtStr(data.user.expiresAt)}
              </div>
            </div>
            <div className="d-flex justify-content-center last_accessed">
              <div className="expires">
                Last accessed: {expiresAtStr(data.user.lastActivityAt)}
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <Status label={data.user.state} />
            </div>

            <div className="d-flex justify-content-center">
              <Link to={`/entry_logs/${data.user.id}`}>Entry Logs &gt;</Link>
            </div>
          </div>
        </div>

        {data.user.state === 'valid' ?
        <div className="row justify-content-center log-entry-form">
          <div className="col-10 col-sm-10 col-md-6">
            <a
              className={`btn btn-primary btn-lg btn-block active ${css(
                styles.logButton
              )}`}
              onClick={onLogEntry}
            >
              Log This Entry
            </a>
          </div>
        </div>
        : null
        }
        <div className="row justify-content-center log-entry-form">
          <div className="col-10 col-sm-10 col-md-6">
            <a
              href='tel:+260976064298'
              className={`btn btn-primary btn-lg btn-block ${css(
                styles.callButton
              )}`}
            >
              Call Poniso
            </a>
          </div>
        </div>
        {authState.user.userType === 'admin' ?
        <Fragment>
          <div className="row justify-content-center log-entry-form">
            <div className="col-10 col-sm-10 col-md-6">
              <Link
                to={`/user/${data.user.id}/edit`}
                className="btn btn-primary btn-lg btn-block active"
              >
                Edit
              </Link>
            </div>
          </div>
          <div className="row justify-content-center log-entry-form">
            <div className="col-10 col-sm-10 col-md-6">
              <Link
                to={`/print/${data.user.id}`}
                className="btn btn-primary btn-lg btn-block active"
              >
                Print
              </Link>
            </div>
          </div>
        </Fragment>
        : null}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  logButton: {
    backgroundColor: "#53d6a5",
    textTransform: "unset"
  },
  callButton: {
    backgroundColor: "#fafafa",
    color: "#ed5757",
    textTransform: "unset"
  }
});
