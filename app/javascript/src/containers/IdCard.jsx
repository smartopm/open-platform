import React, { useContext } from "react";
import { useQuery } from "react-apollo";
import { QRCode } from "react-qr-svg";
import Loading from "../components/Loading.jsx";
import DateUtil from "../utils/dateutil.js";
import { UserQuery } from "../graphql/queries";
import { Context } from "./Provider/AuthStateProvider";
import Nav from "../components/Nav.jsx";
import ErrorPage from "../components/Error.jsx";

function expiresAtStr(datetime) {
  if (datetime) {
    const date = DateUtil.fromISO8601(datetime);
    return (
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
  }
  return "Never";
}

function qrCodeAddress(id_card_token) {
  return (
    window.location.protocol +
    "//" +
    window.location.hostname +
    "/user/" +
    id_card_token
  );
}

export default () => {
  const authState = useContext(Context);
  const { loading, error, data } = useQuery(UserQuery, {
    variables: { id: authState.user.id }
  });
  if (loading) return <Loading />;
  if (error) return <ErrorPage title={error.message} />;

  return <Component data={data} />;
};

export function Component({ data }) {
  return (
    <div>
      <Nav navName="Identify" menuButton="back" />
      <div className="row justify-content-center">
        <div className="card id_card_box col-10 col-sm-10 col-md-6">
          <div
            className="d-flex justify-content-center"
            style={{ marginBottom: "1em" }}
          >
            <div className="member_type">{data.user.userType}</div>
          </div>
          <div className="d-flex justify-content-center">
            <h1>
              <strong>{data.user.name}</strong>
            </h1>
          </div>
          <div className="d-flex justify-content-center">
            <div className="expires">
              Exp: {expiresAtStr(data.user.expiresAt)}
            </div>
          </div>
          <br />
          <br />

          <div className="d-flex justify-content-center qr_code">
            <QRCode
              style={{ width: 256 }}
              value={qrCodeAddress(data.user.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
