import React, { Fragment, useState } from "react";
import { useQuery, useMutation } from "react-apollo";
import Nav from "../../components/Nav";
import { TextField, MenuItem, Button } from "@material-ui/core";
import { EntryRequestQuery } from "../../graphql/queries.js";
import {
  EntryRequestUpdate,
  EntryRequestGrant,
  EntryRequestDeny,
  CreateUserMutation
} from "../../graphql/mutations.js";
import Loading from "../../components/Loading";
import { StyleSheet, css } from "aphrodite";
import DateUtil from "../../utils/dateutil";


export default function RequestUpdate({ match, history, location }) {
  const previousRoute = location.state ? location.state.from : "any";
  const isFromLogs = previousRoute === "logs" || false;

  const { loading, data } = useQuery(EntryRequestQuery, {
    variables: { id: match.params.id }
  });
  const [updateEntryRequest] = useMutation(EntryRequestUpdate);
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [denyEntry] = useMutation(EntryRequestDeny);
  const [createUser] = useMutation(CreateUserMutation)
  const [isLoading, setLoading] = useState(false)
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
    setLoading(true)
    handleUpdateRecord()
      .then(grantEntry({ variables: { id: match.params.id } }))
      .then(() => {
        history.push("/entry_logs", { tab: 1 });
        setLoading(false)
      });
  }

  function handleDenyRequest() {
    setLoading(true)
    handleUpdateRecord()
      .then(denyEntry({ variables: { id: match.params.id } }))
      .then(() => {
        history.push("/entry_logs", { tab: 1 });
        setLoading(false)
      });
  }

  function handleEnrollUser(){
    setLoading(true)
    createUser({
      variables: {
        name: formData.name,
        state: 'pending',
        userType: 'client',
        reason: formData.reason,
        nrc: formData.nrc,
        vehicle: formData.vehiclePlate
      }
    }).then(() => {
      setLoading(false)
    })
  }
  return (
    <Fragment>
      <Nav
      // navname should be enroll user if coming from entry_logs
        navName={previousRoute === "logs" ? "Request Access" : previousRoute === "enroll" ? "Enroll User" : "Approve Request"}
        menuButton="cancel"
      />
      <div className="container">
        <form>
          {isFromLogs && (
            <div className="form-group">
              <label className="bmd-label-static" htmlFor="date">
                Date and time submitted
              </label>
              <input
                className="form-control"
                type="text"
                value={
                  formData.guard
                    ? `${new Date(
                        formData.createdAt
                      ).toDateString()} at ${DateUtil.dateTimeToString(
                        new Date(formData.createdAt)
                      )}`
                    : ""
                }
                disabled={true}
                name="date"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              Guard
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.guard ? formData.guard.name : ""}
              disabled={true}
              name="name"
              required
            />
          </div>
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

          {previousRoute === 'enroll' ?

            (
            <div className="row justify-content-center align-items-center">
              <Button
                variant="contained"
                onClick={handleEnrollUser}
                className={`btn ${css(styles.grantButton)}`}
                disabled={isLoading}
              >
               {isLoading ? 'Enrolling ...' : ' Enroll User'}
              </Button>
            </div>
            )
          : !/logs|enroll/.test(previousRoute) 
          ? (
            <div className="row justify-content-center align-items-center">
              <Button
                variant="contained"
                onClick={handleGrantRequest}
                className={`btn ${css(styles.grantButton)}`}
                disabled={isLoading}
              >
                { isLoading ? 'Granting ...' : 'Grant' }
              </Button>
              <Button
                variant="contained"
                onClick={handleDenyRequest}
                className={`btn  ${css(styles.denyButton)}`}
                disabled={isLoading}
              >
                Deny
              </Button>
            </div>
          ): <span />}
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
    marginRight: 60,
    width: "35%"
  },
  denyButton: {
    backgroundColor: "rgb(230, 63, 69)",
    color: "#FFF",
    width: "35%"
  }
});
