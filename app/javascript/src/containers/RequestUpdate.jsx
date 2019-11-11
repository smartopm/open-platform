import React, { Fragment } from "react";
import Nav from "../components/Nav";
import { TextField, MenuItem, Button } from "@material-ui/core";
import { StyleSheet, css } from "aphrodite";

export default function RequestUpdate() {
  // Todo: Get the request Id from the url
  // Todo: Query the requests and display depending on the table

  //   request mock, to prototype the request form
  // ideally this will come from the db
  const request = {
    name: "Olivier Req",
    nrc: "101010/10/1",
    phoneNumber: "260923423423",
    vehicle: "13409",
    reason: "Delivering sand"
  };
  function handleGrantRequest() {}
  function handleDenyRequest() {}
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
              value={request.name}
              name="_name"
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
              value={request.nrc}
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
              value={request.phoneNumber}
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
              value={request.vehicle}
              name="vehicle"
            />
          </div>
          <div className="form-group">
            <TextField
              id="reason"
              select
              label="Reason for visit"
              name="reason"
              value={request.reason}
              className={`${css(styles.selectInput)}`}
            >
              <MenuItem value={request.reason}>{request.reason}</MenuItem>
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
    backgroundColor: "#25c0b0",
    color: "#FFF",
    width: "75%",
    boxShadow: "none"
  },
  selectInput: {
    width: "100%"
  },
  grantButton: {
    backgroundColor: "#25c0b0",
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
