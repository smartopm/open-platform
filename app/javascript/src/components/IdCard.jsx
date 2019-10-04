import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { QRCode } from "react-qr-svg";
import Nav from './Nav'

import Loading from "./Loading.jsx";
import DateUtil from "../utils/dateutil.js";

const QUERY = gql`
query Member($id: ID!) {
  member(id: $id) {
    id
    memberType
    expiresAt
    user {
      name
      email
      id
    }
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

function qrCodeAddress(id_card_token) {
  return window.location.protocol + '//' + window.location.hostname + '/id_verify/' + id_card_token
}

export default ({ match }) => {
  let id = match.params.id
  const { loading, error, data } = useQuery(QUERY, {variables: {id}});
  if (loading) return <Loading />;
  if (error) return `Error! ${error}`;

  return <Component data={data} />
}

export function Component({ data }) {
  return (
    <div>
      <Nav navName="Identify" menuButton="back" />
      <div className="row justify-content-center">
        <div className="card id_card_box col-10 col-sm-10 col-md-6">
          <div className="d-flex justify-content-center">
            <div className="member_type">{data.member.memberType}</div>
          </div>
          <div className="d-flex justify-content-center">
            <h1>{ data.member.user.name }</h1>
          </div>
          <div className="d-flex justify-content-center">
            <div className="expires">Exp: { expiresAtStr(data.member.expiresAt) }</div>
          </div>

          <div className="d-flex justify-content-center qr_code">
            <QRCode style={{ width: 256 }} value={qrCodeAddress(data.member.id)} />
          </div>
        </div>
      </div>
    </div>
  );
}
