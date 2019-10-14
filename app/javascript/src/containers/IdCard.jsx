import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { QRCode } from "react-qr-svg";
import Nav from '../components/Nav'
import Loading from "../components/Loading.jsx";

import Avatar from "../components/Avatar";

import DateUtil from "../utils/dateutil.js";

const QUERY = gql`
query User($id: ID!) {
  user(id: $id) {
    id
    imageUrl
    userType
    expiresAt
    name
    email
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
  return window.location.protocol + '//' + window.location.hostname + '/user/' + id_card_token
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
          <div className="d-flex justify-content-center" style={{'margin-bottom':'1em'}}>
            <div className="member_type">{data.user.userType}</div>
          </div>
          <Avatar imageURL={data.user.imageUrl} style='small' />
          <div className="d-flex justify-content-center">
            <h1>{ data.user.name }</h1>
          </div>
          <div className="d-flex justify-content-center">
            <div className="expires">Exp: { expiresAtStr(data.user.expiresAt) }</div>
          </div>

          <div className="d-flex justify-content-center qr_code">
            <QRCode style={{ width: 256 }} value={qrCodeAddress(data.user.id)} />
          </div>
        </div>
      </div>
    </div>
  );
}
