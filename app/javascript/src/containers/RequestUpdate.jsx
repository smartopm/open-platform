import React, { Fragment, useState } from "react";
import { useQuery, useMutation } from "react-apollo";
import Nav from "../components/Nav";
import { TextField, MenuItem, Button } from "@material-ui/core";
import { EntryRequestQuery } from "../graphql/queries.js";
import {
  EntryRequestUpdate,
  EntryRequestGrant,
  EntryRequestDeny
} from "../graphql/mutations.js";
import Loading from "../components/Loading";
import { StyleSheet, css } from "aphrodite";

export default function RequestUpdate({ match, history }) {
  // Todo: Get the request Id from the url
  // Todo: Query the requests and display depending on the table

  //   request mock, to prototype the request form
  // ideally this will come from the db
  const { loading, data } = useQuery(EntryRequestQuery, {
    variables: { id: match.params.id }
  });
  const [updateEntryRequest] = useMutation(EntryRequestUpdate);
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [denyEntry] = useMutation(EntryRequestDeny);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    nrc: "",
    vehiclePlate: "",
    reason: "",
    loaded: false
  });

  if (loading) {
    return <Loading />;
  }

  // Data is loaded, so set the initialState, but only once
  if (!formData.loaded && data) {
    setFormData({ ...data.result, loaded: true });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleUpdateRecord() {
    return updateEntryRequest({ variables: formData });
  }

  function handleGrantRequest() {
    handleUpdateRecord()
      .then(grantEntry({ variables: { id: match.params.id } }))
      .then(() => {
        history.push("/requests");
      });
  }

  function handleDenyRequest() {
    handleUpdateRecord()
      .then(denyEntry({ variables: { id: match.params.id } }))
      .then(() => {
        history.push("/requests");
      });
  }

  return (
    <Fragment>
      <Nav navName="Approve Request" menuButton="cancel" />
      <div className="container">
        <form>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              NAME
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              required
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="nrc">
              NRC
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.nrc || ""}
              onChange={handleInputChange}
              name="nrc"
              required
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="phoneNumber">
              Phone N&#176;
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              name="phoneNumber"
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="vehicle">
              VEHICLE PLATE N&#176;
            </label>
            <input
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={formData.vehiclePlate || ""}
              name="vehiclePlate"
            />
          </div>
          <div className="form-group">
            <TextField
              id="reason"
              select
              label="Reason for visit"
              name="reason"
              value={formData.reason || ""}
              onChange={handleInputChange}
              className={`${css(styles.selectInput)}`}
            >
              <MenuItem value={formData.reason}>{formData.reason}</MenuItem>
            </TextField>
          </div>

          <div className="row justify-content-center align-items-center">
            <Button
              variant="contained"
              onClick={handleGrantRequest}
              className={`btn ${css(styles.grantButton)}`}
            >
              Grant
            </Button>
            <Button
              variant="contained"
              onClick={handleDenyRequest}
              className={`btn  ${css(styles.denyButton)}`}
            >
              Deny
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  logButton: {
    backgroundColor: "#53d6a5",
    color: "#FFF",
    width: "75%",
    boxShadow: "none"
  },
  selectInput: {
    width: "100%"
  },
  grantButton: {
    backgroundColor: "#53d6a5",
    color: "#FFF",
    display: "inline-block",
    width: "180px"
  },
  denyButton: {
    backgroundColor: "rgb(230, 63, 69)",
    color: "#FFF",
    display: "inline-block",
    width: "180px",
    marginLeft: "12px"
  }
});
