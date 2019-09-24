import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { QRCode } from "react-qr-svg";

import Loading from "./Loading.jsx";

const IdQuery = gql`
query Member($id: ID!) {
  member(id: $id) {
    id
    memberType
    user {
      name
      email
      id
    }
  }
}
`;

export default ({ match }) => {
  let id = match.params.id
  return (
    <Query query={IdQuery} variables={{id}}>
      {({ data, loading }) => (
      <div>
        {loading
        ? <Loading /> :
        <div key={data.member.id}>
          <b>{data.member.memberType}</b> {data.member.user.name}
          <QRCode style={{ width: 256 }} value={data.member.user.id} />
        </div>
        }
      </div>
      )}
    </Query>
  );
};
